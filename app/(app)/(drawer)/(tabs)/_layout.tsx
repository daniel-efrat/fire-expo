import { Tabs } from "expo-router";
import React from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

/**
 * TabLayout manages the bottom tab navigation while integrating with a drawer menu.
 * This layout serves as a nested navigation setup where:
 * - The drawer navigation is the parent (defined in the parent layout)
 * - The tab navigation is nested inside the drawer
 */
export default function TabLayout() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6', // primary color
        tabBarInactiveTintColor: '#9CA3AF', // text-secondary-dark
        tabBarStyle: {
          backgroundColor: '#111827', // bg-background-dark
          borderTopColor: '#374151', // border-dark
        },
        headerStyle: {
          backgroundColor: '#111827', // bg-background-dark
        },
        headerTintColor: '#F9FAFB', // text-dark
        headerShown: true,
        /**
         * Add hamburger menu button to all tab headers by default
         * This is placed in screenOptions to avoid repetition across screens
         * Each screen can override this by setting headerLeft: () => null
         */
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="menu" size={24} color="#F9FAFB" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="productions"
        options={{
          // Override to remove menu button for this specific screen
          headerLeft: () => null,
          title: "Productions",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "film" : "film-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          // Override to remove menu button for this specific screen
          headerLeft: () => null,
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
