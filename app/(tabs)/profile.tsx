import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, ScrollView } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useUser } from "../../context/UserContext";
import { Fonts } from "../../constants/theme";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ProfileScreen() {
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState<any[]>([]);

  const fetchUserPosts = async () => {
    if (!user?.username) return;
    const postsCollectionRef = collection(db, "posts");
    const q = query(
      postsCollectionRef,
      where("username", "==", user.username),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const postsArray: any[] = [];
    querySnapshot.forEach((doc) => {
      postsArray.push(doc.data());
    });
    setUserPosts(postsArray);
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.logoText}>Framez</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <ThemedText style={styles.headerFeedText}>Profile</ThemedText>
        </View>
      </ThemedView>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar and Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <ThemedText style={styles.avatarText}>
              {user?.fullname?.charAt(0).toUpperCase() || "U"}
            </ThemedText>
          </View>
          <ThemedText style={styles.nameText}>
            {user?.fullname || "Unknown User"}
          </ThemedText>
          <ThemedText style={styles.usernameText}>
            @{user?.username || "username"}
          </ThemedText>
          <ThemedText style={styles.emailText}>{user?.email}</ThemedText>
        </View>

        {/* User’s Posts */}
        <ThemedText style={styles.sectionTitle}>Your Posts</ThemedText>

        {userPosts.length === 0 ? (
          <ThemedText style={styles.noPostsText}>
            You haven’t created any posts yet.
          </ThemedText>
        ) : (
          userPosts.map((post, index) => {
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
                  <ThemedText style={styles.postText}>{post.text}</ThemedText>
                  <ThemedText style={styles.dateText}>
                    {new Date(post.createdAt?.seconds * 1000).toLocaleString()}
                  </ThemedText>
                </View>
              </View>
            );
          })
        )}
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
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF69B4",
    marginBottom: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  nameText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: Fonts.sans,
  },
  usernameText: {
    color: "#FF69B4",
    fontSize: 16,
    marginTop: 4,
  },
  emailText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF69B4",
    fontFamily: Fonts.sans,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  noPostsText: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
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
});
