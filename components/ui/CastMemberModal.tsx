import { View, Text, Pressable } from "react-native";
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
import { useState } from "react";

interface CastMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  }) => void;
  initialData?: {
    name: string;
    production_role: string;
    email: string;
    phone?: string;
  };
  mode?: 'add' | 'edit';
}

export function CastMemberModal({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = 'add'
}: CastMemberModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [role, setRole] = useState(initialData?.production_role || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");

  const handleSubmit = () => {
    if (name && role && email) {
      onSubmit({ name, role, email, phone: phone || undefined });
      setName("");
      setRole("");
      setEmail("");
      setPhone("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <View style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 50
      }}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(26, 26, 26, 0.5)",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}>
        <DialogContent className="w-[90%] max-w-[400px] bg-[#1a1a1a] p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white mb-2">
              {mode === 'edit' ? 'Edit Cast Member' : 'Add Cast Member'}
            </DialogTitle>
            <DialogDescription className="text-[#aaa] mb-4 description">
              Enter the cast member's details below
            </DialogDescription>
          </DialogHeader>

          {/* Name Input */}
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
            <Input
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              style={{
                height: 40,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#333",
                color: "#fff",
              }}
              placeholderTextColor="#666"
            />
          </View>

          {/* Role Input */}
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
            <Input
              placeholder="e.g. Lead Actor, Supporting Actor"
              value={role}
              onChangeText={setRole}
              style={{
                height: 40,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#333",
                color: "#fff",
              }}
              placeholderTextColor="#666"
            />
          </View>

          {/* Email Input */}
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
            <Input
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={{
                height: 40,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#333",
                color: "#fff",
              }}
              placeholderTextColor="#666"
            />
          </View>

          {/* Phone Input (Optional) */}
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
            <Input
              placeholder="+1 234 567 8900"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={{
                height: 40,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#333",
                color: "#fff",
              }}
              placeholderTextColor="#666"
            />
          </View>

          {/* Action Buttons */}
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
              onPress={onClose}
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
              onPress={handleSubmit}
            >
              <Text style={{ color: "#fff" }}>{mode === 'edit' ? 'Save Changes' : 'Add Member'}</Text>
            </Pressable>
          </View>
        </DialogContent>
        </View>
      </View>
    </Dialog>
  );
}
