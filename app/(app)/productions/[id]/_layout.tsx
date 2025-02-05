import { Tabs, router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useEffect, useState } from "react";
import { fetchProductionById } from "@/lib/firestore-service";
import { Production } from "@/lib/firestore-service";

export default function ProductionDetailsLayout() {
  const { id } = useLocalSearchParams();
  const [production, setProduction] = useState<Production | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      fetchProductionById(id).then(setProduction);
    }
  }, [id]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111827", // bg-background-dark
          borderTopColor: "#374151", // border-dark
        },
        tabBarActiveTintColor: "#3B82F6", // primary
        tabBarInactiveTintColor: "#9CA3AF", // text-secondary-dark
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarLabel: "Overview",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "information-circle" : "information-circle-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cast"
        options={{
          title: "Cast",
          tabBarLabel: "Cast",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "people" : "people-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="screen"
        options={{
          title: "Screen",
          tabBarLabel: "Screen",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "tv" : "tv-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="creative"
        options={{
          title: "Creative",
          tabBarLabel: "Creative",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "color-palette" : "color-palette-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scenes"
        options={{
          title: "Scenes",
          tabBarLabel: "Scenes",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "film" : "film-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarLabel: "Schedule",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "calendar" : "calendar-outline"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
