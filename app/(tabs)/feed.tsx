import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Image, TouchableOpacity, Text } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useUser } from "../../context/UserContext";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Fonts } from "../../constants/theme";
import { useRouter } from "expo-router";

export default function FeedScreen() {
  const { user } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();

  const postsCollectionRef = collection(db, "posts");
  const q = query(postsCollectionRef, orderBy("createdAt", "desc"));

  const getLatestPosts = async () => {
    const querySnapshot = await getDocs(q);
    const postsArray: any[] = [];
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      postsArray.push(postData);
    });
    setPosts(postsArray);
  };

  useEffect(() => {
    if (user) {
      getLatestPosts();
    }
  }, [user]);

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loginPrompt}>
          <ThemedText style={styles.promptText}>
            Please log in to view the feed
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

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.logoText}>Framez</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <ThemedText style={styles.headerFeedText}>Feed</ThemedText>
        </View>
      </ThemedView>

      {/* Scrollable Feed */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <ThemedText style={styles.title} type="title">
          Feed
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          View posts from other users
        </ThemedText> */}

        {/* Post Cards */}
        {posts.map((post, index) => {
          const hasImage = post.imageUrl && post.imageUrl.trim() !== "";

          return (
            <View
              key={index}
              style={hasImage ? styles.postCard : styles.textOnlyCard}
            >
              {hasImage && (
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.postContent}>
                <ThemedText style={styles.username}>
                  @{post.username || "Anonymous"}
                </ThemedText>
                <ThemedText style={styles.postText}>{post.text}</ThemedText>
                <ThemedText style={styles.dateText}>
                  {new Date(post.createdAt?.seconds * 1000).toLocaleString()}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF69B4",
    fontFamily: Fonts.sans,
    letterSpacing: 1,
  },
  headerFeedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: Fonts.sans,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF69B4",
    fontFamily: Fonts.sans,
    marginBottom: 4,
  },
  subtitle: {
    color: "#ccc",
    marginBottom: 20,
  },
  postCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  textOnlyCard: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  postImage: {
    width: "100%",
    height: 250,
  },
  postContent: {
    padding: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 6,
  },
  postText: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 20,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
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
