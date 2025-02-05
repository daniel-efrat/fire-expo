import React from "react";
import { Pressable, PressableProps, Text } from "react-native";
import { cn } from "@/lib/utils";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "default",
  size = "default",
  className,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center rounded-md px-4 py-2",
        {
          "bg-primary": variant === "default",
          "border border-input bg-background": variant === "outline",
          "bg-transparent": variant === "ghost",
          "h-9": size === "default",
          "h-8 px-3": size === "sm",
          "h-10 px-8": size === "lg",
          "opacity-50": disabled,
        },
        className
      )}
      disabled={disabled}
      style={style}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={cn("text-sm font-medium", {
            "text-primary-foreground": variant === "default",
            "text-foreground": variant === "outline" || variant === "ghost",
          })}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
