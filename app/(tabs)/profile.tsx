import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { useUser } from "../../context/UserContext";
import { Fonts } from "../../constants/theme";
/* import { useThemeColor } from "../../hooks/use-theme-color"; */


export default function ProfileScreen() {
  const { user } = useUser();
  /* const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text'); */

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText} type="title">Welcome to your Profile</ThemedText>
      </ThemedView>
      <ThemedView style={styles.headerBody}>
        {/* Avatar Placeholder */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.fullname?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        <ThemedText style={styles.title} type="title">Profile</ThemedText>
        <ThemedText type="subtitle">Here are your profile details</ThemedText>

        <ThemedView style={styles.profileCard}>
          <ThemedText style={styles.detailItem} type="defaultSemiBold">
            Full Name: {user?.fullname}
          </ThemedText>
          <ThemedText style={styles.detailItem} type="defaultSemiBold">
            Username: {user?.username}
          </ThemedText>
          <ThemedText style={styles.detailItem} type="defaultSemiBold">
            Email: {user?.email}
          </ThemedText>
        </ThemedView>
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
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    alignSelf: "center",
    backgroundColor: "#FF69B4",
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  profileCard: {
    backgroundColor: "Colors.light.background",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailItem: {
    marginVertical: 5,
  },
});
