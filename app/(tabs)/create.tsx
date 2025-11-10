import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { Fonts } from "../../constants/theme";
import { uploadImageToCloudinary } from "../utils/uploadImage";
import { db } from "@/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@/context/UserContext";

export default function CreateScreen() {
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

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
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText} type="title">
          Create your post here
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.headerBody}>
        <ThemedText style={styles.title} type="title">
          Create Post
        </ThemedText>
        <ThemedText type="subtitle">Share your thoughts and images</ThemedText>

        <ThemedView style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="What's on your mind?"
            value={text}
            onChangeText={setText}
            multiline
          />

          <TouchableOpacity style={styles.imageButton} onPress={handleImageSelect}>
            <ThemedText style={styles.buttonText}>Select Image</ThemedText>
          </TouchableOpacity>

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              contentFit="cover"
            />
          )}
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
    gap: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF69B4",
    fontFamily: Fonts.sans,
  },
  header: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000ff",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: Fonts.sans,
  },
  headerBody: {
    width: "100%",
    flex: 1,
    padding: 20,
  },
  inputCard: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#121212",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
    padding: 10,
    color: "#ccc",
    marginBottom: 10,
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: "#FF69B4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  postButton: {
    backgroundColor: "#FF69B4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "flex-end",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
