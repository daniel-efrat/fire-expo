import { View, Text } from "react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ProductionModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (data: { title: string; description: string }) => void; }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (title && description) {
      onSubmit({ title, description });
      setTitle("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Production</DialogTitle>
          <DialogDescription>
            Enter the production details below
          </DialogDescription>
        </DialogHeader>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-text-dark mb-1 ml-1">Title</Text>
            <Input
              placeholder="Production Title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-text-dark mb-1 ml-1">Description</Text>
            <Input
              placeholder="Production Description"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        <DialogFooter>
          <Button variant="outline" onPress={onClose}>Cancel</Button>
          <Button onPress={handleSubmit}>Add Production</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
