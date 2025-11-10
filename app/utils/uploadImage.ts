import { uploadToCloudinary } from "@/cloudinary";
import { Platform } from "react-native";

export const uploadImageToCloudinary = async (uri: string, userId: string) => {
  try {
    const fileExt = uri.split(".").pop();
    const publicId = `${userId}-${Date.now()}`;
    const uploadOptions = {
      folder: "posts",
      public_id: publicId,
      resource_type: "image",
    };

    let imageUrl: string;

    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();

      const result: any = await uploadToCloudinary(blob, uploadOptions);
      imageUrl = result.secure_url || result.url; 
    } else {
      const FileSystem = await import("expo-file-system/legacy");
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64Data = `data:image/${fileExt};base64,${base64}`;
      const result: any = await uploadToCloudinary(base64Data, uploadOptions);
      imageUrl = result.secure_url || result.url; 
    }

    return imageUrl;
  } catch (error) {
    console.log("Error uploading image to Cloudinary:", error);
    return null;
  }
};
