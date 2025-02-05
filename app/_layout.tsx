import { SessionProvider } from "@/context";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import { ToastProvider } from "@/components/ui/toast";
// Import your global CSS file
import "../global.css";
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

/**
 * Root Layout is the highest-level layout in the app, wrapping all other layouts and screens.
 * It provides:
 * 1. Global authentication context via SessionProvider
 * 2. Gesture handling support for the entire app
 * 3. Global styles and configurations
 *
 * This layout affects every screen in the app, including both authenticated
 * and unauthenticated routes.
 */
export default function Root() {
  useEffect(() => {
    Ionicons.loadFont().catch(console.error);
  }, []);
  // Set up the auth context and render our layout inside of it.
  return (
    <SessionProvider>
      {/* 
        GestureHandlerRootView is required for:
        - Drawer navigation gestures
        - Swipe gestures
        - Other gesture-based interactions
        Must wrap the entire app to function properly
      */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-background-dark">
          {/* 
            Slot renders child routes dynamically
            This includes both (app) and (auth) group routes
          */}
          <ToastProvider>
            <Slot />
          </ToastProvider>
        </View>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
