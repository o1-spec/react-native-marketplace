import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View, Text } from 'react-native';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#4ECDC4',
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 20,
        borderLeftWidth: 6,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 4,
      }}
      text2Style={{
        fontSize: 14,
        color: '#636E72',
        fontWeight: '500',
      }}
      leadingIcon={{
        name: 'checkmark-circle',
        type: 'ionicon',
        color: '#4ECDC4',
        size: 24,
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#FF6B6B',
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 20,
        borderLeftWidth: 6,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 4,
      }}
      text2Style={{
        fontSize: 14,
        color: '#636E72',
        fontWeight: '500',
      }}
      leadingIcon={{
        name: 'close-circle',
        type: 'ionicon',
        color: '#FF6B6B',
        size: 24,
      }}
    />
  ),

  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#FFB84D',
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        marginHorizontal: 20,
        borderLeftWidth: 6,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3436',
        marginBottom: 4,
      }}
      text2Style={{
        fontSize: 14,
        color: '#636E72',
        fontWeight: '500',
      }}
      leadingIcon={{
        name: 'information-circle',
        type: 'ionicon',
        color: '#FFB84D',
        size: 24,
      }}
    />
  ),
};