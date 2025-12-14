import AnimatedTabIcon from '@/components/AnimatedTabIcon';
import { BadgePulse } from '@/components/BadgeBounce';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#B2BEC3',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'search' : 'search-outline'}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Sell',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name="add-circle"
              color={focused ? '#4ECDC4' : color}
              size={size + 8}
              focused={focused}
            />
          ),
          tabBarLabel: 'Sell',
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <AnimatedTabIcon
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                color={color}
                size={size}
                focused={focused}
              />
              {/* Pulsing badge */}
              <BadgePulse>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </BadgePulse>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});