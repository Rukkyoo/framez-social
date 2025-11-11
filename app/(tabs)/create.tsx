import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { Fonts } from "../../constants/theme";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import { db } from "@/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";

export default function CreateScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loginPrompt}>
          <ThemedText style={styles.promptText}>
            Please log in to create posts
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const handleImageSelect = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    } else {
      Alert.alert("No image selected", "You did not select any image.");
    }
  };

  const handlePost = async () => {
    if (!text.trim() && !imageUri) {
      Alert.alert("Error", "Please enter some text or select an image.");
      return;
    }

    try {
      setLoading(true);
      let imageUrl: string | null = null;

      if (imageUri) {
        imageUrl = await uploadImageToCloudinary(imageUri, user?.uid || "");
        if (!imageUrl) throw new Error("Failed to upload image to Cloudinary");
      }

      await addDoc(collection(db, "posts"), {
        text: text.trim(),
        imageUrl,
        userId: user?.uid,
        username: user?.username || "Anonymous",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Your post was created successfully!");
      setText("");
      setImageUri(undefined);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.brandText}>Framez</ThemedText>
        <ThemedText style={styles.headerTitle}>Create</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Create Post</ThemedText>
        <ThemedText type="subtitle">Share your thoughts and moments</ThemedText>

        <ThemedView
          style={[styles.postCard, !imageUri && { paddingVertical: 30 }]}
        >
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#777"
            value={text}
            onChangeText={setText}
            multiline
          />

          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderBox}>
              <ThemedText style={styles.placeholderText}>
                No image selected
              </ThemedText>
            </View>
          )}

          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleImageSelect}
          >
            <ThemedText style={styles.buttonText}>Select Image</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity
          style={[styles.postButton, loading && { opacity: 0.5 }]}
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.postButtonText}>Post</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#1a1a1a",
    borderBottomWidth: 1,
  },
  brandText: {
    color: "#FF69B4",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: Fonts.sans,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: Fonts.sans,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF69B4",
    fontFamily: Fonts.sans,
    marginBottom: 8,
  },
  postCard: {
    backgroundColor: "#121212",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#ddd",
    fontSize: 16,
    marginBottom: 15,
    minHeight: 80,
  },
  placeholderBox: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  placeholderText: {
    color: "#777",
    fontSize: 14,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: "#FF69B4",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  postButton: {
    backgroundColor: "#FF69B4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  promptText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#FF69B4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
