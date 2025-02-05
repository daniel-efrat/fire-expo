import { Stack } from "expo-router";
import { View } from "react-native";

/**
 * Layout for production routes.
 * This wraps all routes under /productions, including:
 * - Individual production details
 * - Nested tabs for production management
 */
export default function ProductionsLayout() {
  return (
    <View className="flex-1 bg-background-dark">
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#111827", // bg-background-dark
          },
          headerTintColor: "#F9FAFB", // text-dark
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen
          name="[id]"
          options={{
            headerTitle: "Production Details",
          }}
        />
      </Stack>
    </View>
  );
}
