import React from "react";
import { View, Modal, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import { cn } from "@/lib/utils";

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Dialog({ children, open, onOpenChange, className }: DialogProps) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  if (!open) return null;

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange?.(false)}
    >
      <TouchableWithoutFeedback onPress={() => onOpenChange?.(false)}>
        <View className="flex-1 justify-center items-center bg-background/80">
          <TouchableWithoutFeedback>
            <View
              className={cn(
                "bg-background rounded-lg shadow-lg mx-4",
                isLargeScreen && "max-w-sm w-full",
                className
              )}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function DialogTrigger({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("p-6", className)}>
      {children}
    </View>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("mb-4", className)}>
      {children}
    </View>
  );
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("text-lg font-semibold", className)}>
      {children}
    </View>
  );
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </View>
  );
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("mt-4 flex-row justify-end space-x-2", className)}>
      {children}
    </View>
  );
}
