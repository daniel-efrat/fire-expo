import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ScenesScreen() {
  const { id } = useLocalSearchParams();
  
  return (
    <View className="flex-1 p-4 bg-background-dark">
      <View className="flex-1 justify-center items-center">
        <Text className="text-text-dark text-lg font-bold mb-2">Scenes</Text>
        <Text className="text-text-secondary-dark">Coming soon</Text>
      </View>
    </View>
  );
}
