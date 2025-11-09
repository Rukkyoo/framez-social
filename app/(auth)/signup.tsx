import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../../firebaseConfig";

export default function SignupScreen() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const validateForm = () => {
      let errors: { [key: string]: string } = {};

      // Validate name field
      if (!fullname) {
        errors.fullname = "Name is required.";
      }

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
  }, [fullname, username, email, password]);

  interface SignupFormData {
    fullname: string;
    username: string;
    email: string;
    password: string;
  }

  interface FramezUserProfile {
    fullname: string;
    username: string;
    createdAt: Date;
  }

  const router = useRouter();

  async function handleSubmit(
    fullname: SignupFormData["fullname"],
    username: SignupFormData["username"],
    email: SignupFormData["email"],
    password: SignupFormData["password"]
  ): Promise<void> {
    if (isFormValid) {
      try {
        const { user } = (await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )) as { user: { uid: string } };

        // store extra information
        const profile: FramezUserProfile = {
          fullname,
          username,
          createdAt: new Date(),
        };
        await setDoc(doc(db, "framez_users", user.uid), profile);
        console.log("User profile created");
        router.push("/feed");
      } catch (error) {
        console.error("Signup error:", error);
      }
    } else {
      // Form is invalid, display error messages
      console.log("Form has errors. Please correct them.");
    }
  }



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        value={fullname}
        placeholder={"Full Name"}
        onChangeText={(text) => setFullname(text)}
      />
      <TextInput
        style={styles.input}
        value={username}
        placeholder={"Username"}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize={"none"}
      />
      <TextInput
        style={styles.input}
        value={email}
        placeholder={"Email"}
        onChangeText={(text) => setEmail(text)}
        keyboardType={"email-address"}
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
        title={"Sign Up"}
        disabled={!isFormValid}
        onPress={() => {
          handleSubmit(fullname, username, email, password);
        }}
      />
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
