import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  fetchProductionCastMembers,
  deleteCastMember,
  addCastMember,
  CastMember,
  updateCastMember,
} from "@/lib/firestore-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";

export default function ProductionCastScreen() {
  const { id } = useLocalSearchParams();
  const [castMembers, setCastMembers] = useState<CastMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    memberData?: CastMember;
  }>({
    isOpen: false,
    mode: "add",
  });

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (modalState.memberData) {
      setFormData({
        name: modalState.memberData.name,
        role: modalState.memberData.production_role,
        email: modalState.memberData.email,
        phone: modalState.memberData.phone || "",
      });
    } else {
      setFormData({
        name: "",
        role: "",
        email: "",
        phone: "",
      });
    }
  }, [modalState.memberData]);

  useEffect(() => {
    async function loadCastMembers() {
      if (typeof id !== "string") {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const members = await fetchProductionCastMembers(id);
        setCastMembers(members);
      } catch (error) {
        console.error("Error loading cast members:", error);
        setCastMembers([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCastMembers();
  }, [id]);

  const handleEditMember = (member: CastMember) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      memberData: member,
    });
  };

  const handleDeletePress = (member: CastMember) => {
    setMemberToDelete({ id: member.id, name: member.name });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete || typeof id !== "string") return;

    try {
      await deleteCastMember(id, memberToDelete.id);
      // Refresh the cast members list
      const updatedMembers = await fetchProductionCastMembers(id);
      setCastMembers(updatedMembers);
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting cast member:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  const handleModalSubmit = async (data: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  }) => {
    if (typeof id !== "string") return;

    try {
      const castData = {
        ...data,
        production_role: data.role,
      };

      if (modalState.mode === "edit" && modalState.memberData) {
        await updateCastMember(id, modalState.memberData.id, castData);
      } else {
        await addCastMember(id, castData);
      }

      const updatedMembers = await fetchProductionCastMembers(id);
      setCastMembers(updatedMembers);
      setModalState({ isOpen: false, mode: "add" });
    } catch (error) {
      console.error("Error saving cast member:", error);
    }
  };

  return isLoading ? (
    <View className="flex-1 justify-center items-center bg-background-dark">
      <Text className="text-text-dark">Loading...</Text>
    </View>
  ) : castMembers.length === 0 ? (
    <View className="flex-1 justify-center items-center gap-4 bg-background-dark">
      <Text className="text-text-dark">No cast members found</Text>
      <Pressable
        className="px-4 py-2 rounded-lg bg-primary"
        onPress={() => setModalState({ isOpen: true, mode: "add" })}
      >
        <Text className="text-white">Add Member</Text>
      </Pressable>
    </View>
  ) : (
    <View className="flex-1 p-4 bg-background-dark">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg font-bold text-text-dark">
          Production Cast
        </Text>
        <Pressable
          className="px-4 py-2 rounded-lg bg-primary"
          onPress={() => setModalState({ isOpen: true, mode: "add" })}
        >
          <Text className="text-white">Add Member</Text>
        </Pressable>
      </View>
      <ScrollView>
        {castMembers.map((member) => (
          <View
            key={member.id}
            className="mb-4 p-4 bg-background-dark border border-border rounded-lg"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-xl font-bold text-text-dark mb-1">
                  {member.name}
                </Text>
                <Text className="text-sm text-text-secondary-dark">
                  Role: {member.production_role}
                </Text>
              </View>
              <View className="flex-row gap-4">
                <TouchableOpacity onPress={() => handleEditMember(member)}>
                  <MaterialIcons name="edit" size={24} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePress(member)}>
                  <MaterialIcons name="delete" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-background-dark p-6 rounded-lg w-[80%] max-w-sm">
            <Text className="text-lg font-bold text-text-dark mb-4">
              Confirm Delete
            </Text>
            <Text className="text-text-dark mb-6">
              Are you sure you want to delete {memberToDelete?.name}?
            </Text>
            <View className="flex-row justify-end gap-4">
              <Button
                style={{ borderRadius: 8, borderWidth: 1, borderColor: "gray" }}
                variant="outline"
                onPress={handleCancelDelete}
                className="text-text-dark"
              >
                Cancel
              </Button>
              <Button
                style={{ borderRadius: 8 }}
                variant="default"
                className="bg-red-500 text-white"
                onPress={handleConfirmDelete}
              >
                Delete
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalState.isOpen} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(26, 26, 26, 0.8)",
          }}
        >
          <View
            style={{
              width: "90%",
              maxWidth: 400,
              backgroundColor: "#1a1a1a",
              padding: 24,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              {modalState.mode === "edit"
                ? "Edit Cast Member"
                : "Add Cast Member"}
            </Text>
            <Text style={{ color: "#aaa", marginBottom: 16 }}>
              Enter the cast member's details below
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Name
              </Text>
              <TextInput
                style={{
                  height: 40,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#333",
                  color: "#fff",
                }}
                placeholder="Full name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                placeholderTextColor="#666"
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Role
              </Text>
              <TextInput
                style={{
                  height: 40,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#333",
                  color: "#fff",
                }}
                placeholder="e.g. Lead Actor, Supporting Actor"
                value={formData.role}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, role: text }))
                }
                placeholderTextColor="#666"
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  height: 40,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#333",
                  color: "#fff",
                }}
                placeholder="email@example.com"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                placeholderTextColor="#666"
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Phone (Optional)
              </Text>
              <TextInput
                style={{
                  height: 40,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#333",
                  color: "#fff",
                }}
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
                keyboardType="phone-pad"
                placeholderTextColor="#666"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <Pressable
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#333",
                }}
                onPress={() => setModalState({ isOpen: false, mode: "add" })}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: "#007bff",
                }}
                onPress={() => {
                  if (formData.name && formData.role && formData.email) {
                    handleModalSubmit({
                      name: formData.name,
                      role: formData.role,
                      email: formData.email,
                      phone: formData.phone || undefined,
                    });
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>
                  {modalState.mode === "edit" ? "Save Changes" : "Add Member"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
