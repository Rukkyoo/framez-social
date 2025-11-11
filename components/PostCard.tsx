import React from 'react';
import {  Image, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface PostCardProps {
  createdAt: any; // Firebase Timestamp
  imageUrl: string;
  text: string;
  username: string;
}

const PostCard: React.FC<PostCardProps> = ({ createdAt, imageUrl, text, username }) => {
  // Format the timestamp (assuming Firebase Timestamp)
  const formattedDate = new Date(createdAt.seconds * 1000).toLocaleDateString() + ' ' + new Date(createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.username} type="defaultSemiBold">{username}</ThemedText>
      <ThemedText style={styles.text}>{text}</ThemedText>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <ThemedText style={styles.date}>{formattedDate}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});

export default PostCard;