import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  fetchProductionCastMembers,
  addCastMember,
  deleteCastMember,
  CastMember,
} from "@/lib/firestore-service";

export default function ProductionCastScreen() {
  const { id } = useLocalSearchParams();
  const [castMembers, setCastMembers] = useState<CastMember[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Load cast members
  useEffect(() => {
    if (typeof id === "string") {
      loadCastMembers();
    }
  }, [id]);

  const loadCastMembers = async () => {
    try {
      if (typeof id !== "string") return;
      const members = await fetchProductionCastMembers(id);
      setCastMembers(members);
    } catch (error) {
      console.error("[error loading cast members] ==>", error);
      setError("Failed to load cast members");
    }
  };

  const handleAddMember = async () => {
    if (!name || !role || !email) {
      setError("Name, role, and email are required");
      return;
    }

    try {
      if (typeof id !== "string") return;

      await addCastMember(id, {
        name,
        production_role: role,
        email,
        phone: phone || undefined,
      });

      // Reset form and close dialog
      setName("");
      setRole("");
      setEmail("");
      setPhone("");
      setIsAddDialogOpen(false);

      // Reload cast members
      loadCastMembers();
    } catch (error) {
      console.error("[error adding cast member] ==>", error);
      setError("Failed to add cast member");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      if (typeof id !== "string") return;
      await deleteCastMember(id, memberId);
      loadCastMembers();
    } catch (error) {
      console.error("[error deleting cast member] ==>", error);
      setError("Failed to delete cast member");
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-white">Cast Members</Text>
        <Button
          onPress={() => setIsAddDialogOpen(true)}
          className="p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 active:opacity-90"
        >
          Add Cast Member
        </Button>
      </View>

      {/* Cast Members List or Empty State */}
      {castMembers.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-sm text-gray-400 mb-4">
            No cast members yet
          </Text>
          <Button
            onPress={() => setIsAddDialogOpen(true)}
            className="p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 active:opacity-90"
          >
            Add Your First Cast Member
          </Button>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="space-y-4">
            {castMembers.map((member) => (
              <Card
                key={member.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-lg font-bold text-white mb-1">
                      {member.name}
                    </Text>
                    <Text className="text-sm text-gray-400">
                      {member.production_role}
                    </Text>
                    <Text className="text-sm text-gray-400 mt-1">
                      {member.email}
                    </Text>
                    {member.phone && (
                      <Text className="text-sm text-gray-400">
                        {member.phone}
                      </Text>
                    )}
                  </View>
                  <Button
                    onPress={() => handleDeleteMember(member.id)}
                    className="p-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Add Cast Member
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Enter the cast member's details below
            </DialogDescription>
          </DialogHeader>

          {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-white mb-1 ml-1">
                Name
              </Text>
              <Input
                placeholder="Full name"
                value={name}
                onChangeText={setName}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-white mb-1 ml-1">
                Role
              </Text>
              <Input
                placeholder="e.g. Lead Actor, Supporting Actor"
                value={role}
                onChangeText={setRole}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-white mb-1 ml-1">
                Email
              </Text>
              <Input
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-white mb-1 ml-1">
                Phone (Optional)
              </Text>
              <Input
                placeholder="+1 234 567 8900"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
            </View>
          </View>

          <DialogFooter>
            <Button
              onPress={() => setIsAddDialogOpen(false)}
              className="p-4 text-white font-semibold border-gray-500 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onPress={handleAddMember}
              className="p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500"
            >
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
