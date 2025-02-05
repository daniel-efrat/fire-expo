import { useSession } from "@/context";
import React from "react";
import { View, Text } from "react-native";

const ProfileScreen = () => {
  // ============================================================================
  // Hooks
  // ============================================================================
  const { user } = useSession();

  // ============================================================================
  // Computed Values
  // ============================================================================

  /**
   * Gets the display name for the welcome message
   * Prioritizes user's name, falls back to email, then default greeting
   */
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Guest";

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <View className="flex-1 p-4 bg-background-dark">
      {/* Welcome Section */}
      <View className="mb-8">
        <Text className="text-xl font-bold text-text-dark">
          Name: <Text className="text-primary">{displayName}</Text>
        </Text>
        <Text className="text-xl font-semibold text-text-dark mt-4">
          Email: <Text className="text-primary">{user?.email}</Text>
        </Text>
        <Text className="text-base text-text-secondary-dark mt-4">
          Last Seen: <Text className="text-primary">{user?.metadata?.lastSignInTime}</Text>
        </Text>
        <Text className="text-base text-text-secondary-dark mt-4">
          Created: <Text className="text-primary">{user?.metadata?.creationTime}</Text>
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
