import { conversationsAPI } from '@/lib/api';
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

interface UnreadCountContextType {
  totalUnreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const UnreadCountContext = createContext<UnreadCountContextType | undefined>(undefined);

export const useUnreadCount = () => {
  const context = useContext(UnreadCountContext);
  if (!context) {
    throw new Error('useUnreadCount must be used within UnreadCountProvider');
  }
  return context;
};

export const UnreadCountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { user, token } = useAuth();

  const refreshUnreadCount = async () => {
    if (!token) return;

    try {
      const response = await conversationsAPI.getConversations();
      const total = response.conversations.reduce(
        (sum: number, conv: any) => sum + (conv.unreadCount || 0), 
        0
      );
      setTotalUnreadCount(total);
    } catch (error) {
      console.error('Failed to refresh unread count:', error);
    }
  };

  useEffect(() => {
    refreshUnreadCount();
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;

    const socket = io('http://localhost:3000', {
      auth: { token }
    });

    socket.on('message', (message: any) => {
      if (message.senderId !== user._id) {
        setTotalUnreadCount(prev => prev + 1);
      }
    });

    socket.on('messagesRead', (data: any) => {
      if (data.userId === user._id) {
        refreshUnreadCount();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user]);

  return (
    <UnreadCountContext.Provider value={{ totalUnreadCount, refreshUnreadCount }}>
      {children}
    </UnreadCountContext.Provider>
  );
};