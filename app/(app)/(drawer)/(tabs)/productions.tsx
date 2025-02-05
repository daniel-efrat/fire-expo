import { Text, View, ScrollView, Pressable, Modal, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/context"; // Use global authentication context
import { auth } from "@/lib/firebase-config";
import {
  Production,
  fetchUserProductions,
  createProduction,
} from "@/lib/firestore-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  producer: z.string().min(1, "Producer is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductionsScreen() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  // Use the global auth state from SessionProvider
  const { user } = useSession();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      producer: "",
    },
  });

  const loadProductions = useCallback(async () => {
    if (!user?.uid) {
      console.log("No authenticated user found");
      return;
    }
    console.log("[Productions] Loading productions for user:", user.uid);
    
    try {
      setIsLoading(true);
      const data = await fetchUserProductions(user.uid);
      setProductions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // When the user changes, load productions using the global auth state
  useEffect(() => {
    if (user) {
      console.log("[Productions] Detected authenticated user, loading productions...");
      loadProductions();
    } else {
      console.log("[Productions] No authenticated user");
      setProductions([]);
    }
  }, [user, loadProductions]);

  const onSubmit = async (data: FormData): Promise<void> => {
    if (!user) return;

    try {
      const newProduction = await createProduction(data, user.uid);
      loadProductions(); // Reload productions after creating a new one
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter();

  const ProductionCard = ({ production }: { production: Production }) => (
    <TouchableOpacity
      style={{ marginBottom: 16 }}
      onPress={() => router.push({
        pathname: "/(app)/productions/[id]",
        params: { id: production.id }
      })}
    >
      <View style={{ padding: 16, backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#333", borderRadius: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 4 }}>
          {production.title}
        </Text>
        <Text style={{ fontSize: 14, color: "#aaa" }}>
          Producer: {production.producer}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#1a1a1a" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>Productions</Text>
        <Pressable
          style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: "#007bff" }}
          onPress={() => setIsDialogOpen(true)}
        >
          <Text style={{ color: "#fff" }}>New Production</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#fff" }}>Loading...</Text>
        </View>
      ) : productions.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#aaa", marginBottom: 16 }}>No productions yet</Text>
          <Pressable
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#333" }}
            onPress={() => setIsDialogOpen(true)}
          >
            <Text style={{ color: "#fff" }}>Create your first production</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView>
          {productions.map((production) => (
            <ProductionCard key={production.id} production={production} />
          ))}
        </ScrollView>
      )}

      <Modal visible={isDialogOpen} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(26, 26, 26, 0.8)" }}>
          <View style={{ width: "90%", maxWidth: 400, backgroundColor: "#1a1a1a", padding: 24, borderRadius: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>
              Create New Production
            </Text>
            <Text style={{ color: "#aaa", marginBottom: 16 }}>
              Add details for your new production
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#fff", marginBottom: 4 }}>Title</Text>
              <TextInput
                style={{ height: 40, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#333", color: "#fff" }}
                placeholder="Enter production title"
                onChangeText={(text: string) => form.setValue("title", text)}
                value={form.watch("title")}
                placeholderTextColor="#666"
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: "500", color: "#fff", marginBottom: 4 }}>Producer</Text>
              <TextInput
                style={{ height: 40, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#333", color: "#fff" }}
                placeholder="Enter producer name"
                onChangeText={(text: string) => form.setValue("producer", text)}
                value={form.watch("producer")}
                placeholderTextColor="#666"
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12 }}>
              <Pressable
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: "#333" }}
                onPress={() => setIsDialogOpen(false)}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: "#007bff" }}
                onPress={form.handleSubmit(onSubmit)}
              >
                <Text style={{ color: "#fff" }}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
