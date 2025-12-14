import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface MenuAction {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

interface LongPressMenuProps {
  children: React.ReactNode;
  actions: MenuAction[];
}

export default function LongPressMenu({ children, actions }: LongPressMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const scale = useSharedValue(1);

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart((event) => {
      // Haptic feedback
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      
      // Scale animation
      scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
      
      // Show menu
      runOnJS(setMenuPosition)({ x: event.x, y: event.y });
      runOnJS(setMenuVisible)(true);
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleActionPress = (action: MenuAction) => {
    setMenuVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action.onPress();
  };

  return (
    <>
      <GestureDetector gesture={longPressGesture}>
        <Animated.View style={animatedStyle}>
          {children}
        </Animated.View>
      </GestureDetector>

      {/* Context Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <Animated.View
            style={[
              styles.menu,
              {
                top: menuPosition.y - 100,
                left: Math.max(20, Math.min(menuPosition.x - 75, 300)),
              },
            ]}
          >
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === actions.length - 1 && styles.lastMenuItem,
                ]}
                onPress={() => handleActionPress(action)}
              >
                <Ionicons
                  name={action.icon as any}
                  size={20}
                  color={action.color || '#2D3436'}
                />
                <Text style={[styles.menuLabel, action.color && { color: action.color }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3436',
  },
});
