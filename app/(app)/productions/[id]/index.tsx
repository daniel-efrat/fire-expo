import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Production, fetchProductionById } from "@/lib/firestore-service";

export default function ProductionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [production, setProduction] = useState<Production | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduction() {
      if (typeof id !== 'string') return;
      
      try {
        setIsLoading(true);
        const data = await fetchProductionById(id);
        setProduction(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduction();
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-dark">
        <Text className="text-text-dark">Loading...</Text>
      </View>
    );
  }

  if (!production) {
    return (
      <View className="flex-1 justify-center items-center bg-background-dark">
        <Text className="text-text-dark">Production not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-background-dark">
      <View className="mb-4 p-4 bg-background-dark border border-border rounded-lg">
        <Text className="text-xl font-bold text-text-dark mb-1">
          {production.title}
        </Text>
        <Text className="text-sm text-text-secondary-dark">
          Producer: {production.producer}
        </Text>
        <Text className="text-sm text-text-secondary-dark mt-2">
          Created: {production.created_at.toDate().toLocaleDateString()}
        </Text>
      </View>

      <Text className="text-lg font-bold text-text-dark mb-4">
        Quick Actions
      </Text>
      
      <View className="flex-row flex-wrap gap-2">
        <Pressable 
          onPress={() => router.push('./cast')}
          className="flex-1 min-w-[150] p-4 bg-background-secondary-dark rounded-lg active:opacity-70"
        >
          <Text className="text-text-dark font-medium mb-1">Cast Members</Text>
          <Text className="text-text-secondary-dark">View List</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => router.push('./creative')}
          className="flex-1 min-w-[150] p-4 bg-background-secondary-dark rounded-lg active:opacity-70"
        >
          <Text className="text-text-dark font-medium mb-1">Creative Team</Text>
          <Text className="text-text-secondary-dark">View List</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => router.push('./scenes')}
          className="flex-1 min-w-[150] p-4 bg-background-secondary-dark rounded-lg active:opacity-70"
        >
          <Text className="text-text-dark font-medium mb-1">Scenes</Text>
          <Text className="text-text-secondary-dark">View List</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => router.push('./schedule')}
          className="flex-1 min-w-[150] p-4 bg-background-secondary-dark rounded-lg active:opacity-70"
        >
          <Text className="text-text-dark font-medium mb-1">Schedule</Text>
          <Text className="text-text-secondary-dark">View List</Text>
        </Pressable>
      </View>
    </View>
  );
}
