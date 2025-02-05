import { router } from "expo-router";
import { Text, TextInput, View, Pressable } from "react-native";
import { useState } from "react";
import { useSession } from "@/context";
import { setUserProfile } from "@/lib/firestore-service";
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useSession();

  const handleSignUpPress = async () => {
    try {
      setError(null);

      // Validate fields
      if (!email) {
        setError("Email is required");
        return;
      }
      if (!email.includes('@')) {
        setError("Invalid email format");
        return;
      }
      if (!password) {
        setError("Password is required");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (!fullName) {
        setError("Full name is required");
        return;
      }

      setIsLoading(true);
      console.log("[SignUp] Starting sign-up process...");

      // Create Firebase user
      const user = await signUp(email, password);
      if (!user) {
        throw new Error("Failed to create user account");
      }
      console.log("[SignUp] Firebase user created:", user.uid);

      // Create user profile in Firestore
      try {
        console.log("[SignUp] Creating user profile...");
        const profileData = {
          email,
          full_name: fullName,
          created_at: Timestamp.now(),
          avatar_url: null
        };
        
        await setUserProfile(user.uid, profileData);
        console.log("[SignUp] Profile created successfully");

        // Navigate to home
        router.replace("/(app)");
      } catch (error) {
        console.error("[SignUp] Profile creation error:", error);
        // Since profile creation failed, clean up the created user
        try {
          console.log("[SignUp] Cleaning up Firebase user");
          await user.delete();
        } catch (deleteError) {
          console.error("[SignUp] Failed to clean up Firebase user:", deleteError);
        }
        throw error;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("[SignUp] Error:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-background-dark">
      {/* Welcome Section */}
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-text-dark mb-2">
          Create Account
        </Text>
        <Text className="text-sm text-text-secondary-dark">
          Sign up to get started
        </Text>
      </View>

      {/* Form Section */}
      <View className="w-full max-w-[300px] space-y-4 mb-8">
        <View>
          <Text className="text-sm font-medium text-text-dark mb-1 ml-1">
            Full Name
          </Text>
          <TextInput
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            textContentType="name"
            autoCapitalize="words"
            className="w-full p-3 border border-border rounded-lg text-base text-text-dark bg-background-dark"
            placeholderTextColor="#666"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-text-dark mb-1 ml-1">
            Email
          </Text>
          <TextInput
            placeholder="name@mail.com"
            value={email}
            onChangeText={setEmail}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full p-3 border border-border rounded-lg text-base text-text-dark bg-background-dark"
            placeholderTextColor="#666"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-text-dark mb-1 ml-1">
            Password
          </Text>
          <TextInput
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
            className="w-full p-3 border border-border rounded-lg text-base text-text-dark bg-background-dark"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <View className="w-full max-w-[300px] mb-4">
          <Text className="text-red-500 text-sm text-center">{error}</Text>
        </View>
      )}

      {/* Sign Up Button */}
      <Button
        onPress={handleSignUpPress}
        disabled={isLoading}
        className="w-full max-w-[300px] mb-4"
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>

      {/* Sign In Link */}
      <View className="flex-row items-center">
        <Text className="text-text-dark">Already have an account?</Text>
        <Pressable onPress={() => router.push("/sign-in")} className="ml-2">
          <Text className="text-primary font-semibold">Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}
