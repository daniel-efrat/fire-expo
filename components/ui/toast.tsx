import React, { createContext, useContext, useCallback, useState } from "react";
import { View, Text, Animated, Dimensions } from "react-native";
import { cn } from "@/lib/utils";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [animation] = useState(new Animated.Value(0));

  const showToast = useCallback(
    (props: ToastProps) => {
      setToast(props);
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToast(null);
      });
    },
    [animation]
  );

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={{
            transform: [{ translateY }],
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
          }}
        >
          <View
            className={cn(
              "m-4 rounded-lg p-4 shadow-lg",
              toast.variant === "destructive"
                ? "bg-destructive text-destructive-foreground"
                : "bg-background text-foreground"
            )}
          >
            {toast.title && (
              <Text className="font-semibold">{toast.title}</Text>
            )}
            {toast.description && (
              <Text className="text-sm opacity-90">{toast.description}</Text>
            )}
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
