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
  fetchProductionCreativeMembers,
  deleteCreativeMember,
  addCreativeMember,
  CreativeMember,
  updateCreativeMember,
} from "@/lib/firestore-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";

export default function ProductionCreativeScreen() {
  const { id } = useLocalSearchParams();
  const [creativeMembers, setCreativeMembers] = useState<CreativeMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    memberData?: CreativeMember;
  }>({
    isOpen: false,
    mode: "add",
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
    async function loadCreativeMembers() {
      if (typeof id !== "string") {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const members = await fetchProductionCreativeMembers(id);
        setCreativeMembers(members);
      } catch (error) {
        console.error("Error loading creative members:", error);
        setCreativeMembers([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCreativeMembers();
  }, [id]);

  const handleEditMember = (member: CreativeMember) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      memberData: member,
    });
  };

  const handleDeletePress = (member: CreativeMember) => {
    setMemberToDelete({ id: member.id, name: member.name });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete || typeof id !== "string") return;

    try {
      await deleteCreativeMember(id, memberToDelete.id);
      // Refresh the creative members list
      const updatedMembers = await fetchProductionCreativeMembers(id);
      setCreativeMembers(updatedMembers);
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting creative member:", error);
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
      const creativeData = {
        ...data,
        production_role: data.role,
      };

      if (modalState.mode === "edit" && modalState.memberData) {
        await updateCreativeMember(id, modalState.memberData.id, creativeData);
      } else {
        await addCreativeMember(id, creativeData);
      }

      const updatedMembers = await fetchProductionCreativeMembers(id);
      setCreativeMembers(updatedMembers);
      setModalState({ isOpen: false, mode: "add" });
    } catch (error) {
      console.error("Error saving creative member:", error);
    }
  };

  if (typeof id !== "string") {
    return (
      <View className="flex-1 justify-center items-center bg-background-dark">
        <Text className="text-text-dark">Invalid production ID</Text>
      </View>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center bg-background-dark">
          <Text className="text-text-dark">Loading...</Text>
        </View>
      );
    }

    if (creativeMembers.length === 0) {
      return (
        <View className="flex-1 justify-center items-center gap-4 bg-background-dark">
          <Text className="text-text-dark">No creative members found</Text>
          <Pressable
            className="px-4 py-2 rounded-lg bg-primary"
            onPress={() => {
              setModalState({
                isOpen: true,
                mode: "add",
              });
            }}
          >
            <Text className="text-white">Add Member</Text>
          </Pressable>
        </View>
      );
    }

    return (
    <View className="flex-1 p-4 bg-background-dark">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg font-bold text-text-dark">
          Production Creative
        </Text>
        <Pressable
          className="px-4 py-2 rounded-lg bg-primary"
          onPress={() => {
            setModalState({
              isOpen: true,
              mode: "add",
            });
          }}
        >
          <Text className="text-white">Add Member</Text>
        </Pressable>
      </View>
      <ScrollView>
        {creativeMembers.map((member) => (
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
    </View>
  );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderContent()}

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

      <Modal 
        visible={modalState.isOpen} 
        transparent 
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[90%] max-w-[400px] bg-[#1a1a1a] p-6 rounded-lg">
            <Text className="text-xl font-bold text-white mb-2">
              {modalState.mode === "edit"
                ? "Edit Creative Member"
                : "Add Creative Member"}
            </Text>
            <Text className="text-gray-400 mb-4">
              Enter the creative member's details below
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-white mb-1">
                Name
              </Text>
              <TextInput
                className="h-10 px-3 rounded-lg border border-neutral-700 text-white"
                placeholder="Full name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
                placeholderTextColor="#666"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-white mb-1">
                Role
              </Text>
              <TextInput
                className="h-10 px-3 rounded-lg border border-neutral-700 text-white"
                placeholder="e.g. Director, Production Designer"
                value={formData.role}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, role: text }))
                }
                placeholderTextColor="#666"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-white mb-1">
                Email
              </Text>
              <TextInput
                className="h-10 px-3 rounded-lg border border-neutral-700 text-white"
                placeholder="email@example.com"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                placeholderTextColor="#666"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-white mb-1">
                Phone (Optional)
              </Text>
              <TextInput
                className="h-10 px-3 rounded-lg border border-neutral-700 text-white"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
                keyboardType="phone-pad"
                placeholderTextColor="#666"
              />
            </View>

            <View className="flex-row justify-end gap-3">
              <Pressable
                className="px-4 py-2 rounded-lg border border-neutral-700"
                onPress={() => setModalState({ isOpen: false, mode: "add" })}
              >
                <Text className="text-white">Cancel</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 rounded-lg bg-primary"
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
                <Text className="text-white">
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
