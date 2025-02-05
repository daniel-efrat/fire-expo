import React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className, style, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-lg border border-border bg-card p-4",
        className
      )}
      style={style}
      {...props}
    />
  );
}
