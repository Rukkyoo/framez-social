import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Pressable
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function SignupScreen() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    fullname: false,
    username: false,
    email: false,
    password: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const validateForm = () => {
      let newErrors: { [key: string]: string } = {};

      if (touched.fullname) {
        if (!fullname) newErrors.fullname = "Full name is required.";
      }

      if (touched.username) {
        if (!username) newErrors.username = "Username is required.";
        else if (username.length < 3)
          newErrors.username = "Username must be at least 3 characters.";
      }

      if (touched.email) {
        if (!email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(email))
          newErrors.email = "Email is invalid.";
      }

      if (touched.password) {
        if (!password) newErrors.password = "Password is required.";
        else if (password.length < 6)
          newErrors.password = "Password must be at least 6 characters.";
      }

      setErrors(newErrors);
      setIsFormValid(
        Boolean(
          Object.keys(newErrors).length === 0 &&
            fullname &&
            username &&
            email &&
            password
        )
      );
    };

    validateForm();
  }, [fullname, username, email, password, touched]);

  interface SignupFormData {
    fullname: string;
    username: string;
    email: string;
    password: string;
  }

  interface FramezUserProfile {
    email: string;
    fullname: string;
    username: string;
    createdAt: Date;
  }

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

        const profile: FramezUserProfile = {
          email,
          fullname,
          username,
          createdAt: new Date(),
        };
        await setDoc(doc(db, "framez_users", user.uid), profile);
        console.log("User profile created", profile);
        router.push("/feed");
      } catch (error) {
        console.error("Signup error:", error);
      }
    } else {
      console.log("Form has errors. Please correct them.");
      setTouched({
        fullname: true,
        username: true,
        email: true,
        password: true,
      }); // show errors if submit too early
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Full Name */}
      <TextInput
        style={styles.input}
        value={fullname}
        placeholder="Full Name"
        placeholderTextColor="#000000"
        onChangeText={(text) => setFullname(text)}
        onBlur={() => setTouched((prev) => ({ ...prev, fullname: true }))}
      />
      {errors.fullname && touched.fullname && (
        <Text style={styles.error}>{errors.fullname}</Text>
      )}

      {/* Username */}
      <TextInput
        style={styles.input}
        value={username}
        placeholder="Username"
        placeholderTextColor="#000000"
        onChangeText={(text) => setUsername(text)}
        onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
        autoCapitalize="none"
      />
      {errors.username && touched.username && (
        <Text style={styles.error}>{errors.username}</Text>
      )}

      {/* Email */}
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        placeholderTextColor="#000000"
        onChangeText={(text) => setEmail(text)}
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && touched.email && (
        <Text style={styles.error}>{errors.email}</Text>
      )}

      {/* Password */}
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password"
        placeholderTextColor="#000000"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
      />
      {errors.password && touched.password && (
        <Text style={styles.error}>{errors.password}</Text>
      )}

      {/* <Button
        title="Sign Up"
        disabled={!isFormValid}
        onPress={() => handleSubmit(fullname, username, email, password)}
      /> */}
      <Pressable
              style={[
                styles.signupButton,
                !isFormValid && styles.disabledButton,
              ]}
              onPress={() => handleSubmit(fullname, username, email, password)}
              disabled={!isFormValid}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </Pressable>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
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
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  signupButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
});
