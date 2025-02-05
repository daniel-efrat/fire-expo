// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

type TabBarIconProps = {
  name: ComponentProps<typeof Ionicons>['name'];
  color: string;
  size?: number;
  style?: any;
};

export function TabBarIcon({ name, color, size = 28, style }: TabBarIconProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={[{ marginBottom: -3 }, style]}
    />
  );
}
