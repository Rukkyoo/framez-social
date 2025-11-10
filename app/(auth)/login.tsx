import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app, db } from "../../firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const auth = getAuth(app);
  const { setUser } = useUser();

  useEffect(() => {
    const validateForm = () => {
      let errors: { [key: string]: string } = {};

      // Validate email field
      if (!email) {
        errors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid.";
      }

      // Validate password field
      if (!password) {
        errors.password = "Password is required.";
      } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters.";
      }

      // Set the errors and update form validity
      setErrors(errors);
      setIsFormValid(Object.keys(errors).length === 0);
    };

    validateForm();
  }, [email, password]);

  const router = useRouter();

  interface SignupFormData {
    email: string;
    password: string;
  }

  async function handleSubmit(
    email: SignupFormData["email"],
    password: SignupFormData["password"]
  ): Promise<void> {
    if (isFormValid) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "framez_users", user.uid));
        if (userDoc.exists()) {
          setUser({
            uid: user.uid,
            email: user.email ?? "",
            ...userDoc.data(),
          } as FramezUser);
        }

        console.log("User logged in successfully:", user);
        router.push("/feed");
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      // Form is invalid, display error messages
      console.log("Form has errors. Please correct them.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder={"Email"}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder={"Password"}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        title={"Login"}
        disabled={!isFormValid}
        onPress={() => {
          handleSubmit(email, password);
        }}
      />
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don&apos;t have an account? Sign Up</Text>
      </TouchableOpacity>
      {/* Display error messages */}
      {Object.values(errors).map((error, index) => (
        <Text key={index} style={styles.error}>
          {error}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FF69B4",
  },
  input: {
    height: 40,
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FF69B4",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  link: {
    marginTop: 20,
    color: "#FF69B4",
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    fontSize: 20,
    marginBottom: 12,
  },
});
