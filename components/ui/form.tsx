import React from "react";
import { Text, View, ViewProps } from "react-native";
import { cn } from "@/lib/utils";

export interface FormProps extends ViewProps {
  className?: string;
  onSubmit?: () => void;
}

function Form({ className, onSubmit, children, ...props }: FormProps) {
  return (
    <View className={cn("space-y-4", className)} {...props}>
      {children}
    </View>
  );
}

export interface FormItemProps extends ViewProps {
  className?: string;
}

const FormItem = React.forwardRef<View, FormItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <View ref={ref} className={cn("space-y-2", className)} {...props} />
    );
  }
);
FormItem.displayName = "FormItem";

interface FormLabelProps {
  className?: string;
  children: React.ReactNode;
}

const FormLabel = React.forwardRef<Text, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn("text-sm font-medium text-text-dark", className)}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
FormLabel.displayName = "FormLabel";

interface FormControlProps extends ViewProps {
  error?: boolean;
}

const FormControl = React.forwardRef<View, FormControlProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <View 
        ref={ref} 
        className={cn("", error && "border-destructive", className)} 
        {...props} 
      />
    );
  }
);
FormControl.displayName = "FormControl";

export { Form, FormItem, FormLabel, FormControl };
