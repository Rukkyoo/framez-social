import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";

interface FramezUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  [key: string]: any;
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const { setUser } = useUser();
  const router = useRouter();

  // Run validation when user interacts with fields
  useEffect(() => {
    const validateForm = () => {
      let newErrors: { [key: string]: string } = {};

      if (touched.email) {
        if (!email) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(email))
          newErrors.email = "Invalid email.";
      }

      if (touched.password) {
        if (!password) newErrors.password = "Password is required.";
        else if (password.length < 6)
          newErrors.password = "Password must be at least 6 characters.";
      }

      setErrors(newErrors);
      setIsFormValid(
        Object.keys(newErrors).length === 0 &&
          Boolean(email) &&
          Boolean(password)
      );
    };

    validateForm();
  }, [email, password, touched]);

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
        setIsLoading(true);
        setAuthError("");
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
      } catch (error: any) {
        console.error("Login error:", error);
        let errorMessage = "An error occurred. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled.";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Try again later.";
        }
        setAuthError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Form has errors. Please correct them.");
      setTouched({ email: true, password: true }); // Show errors if trying to submit too early
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
        placeholderTextColor="#666"
        onChangeText={(text) => setEmail(text)}
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        autoCapitalize="none"
      />
      {errors.email && touched.email && (
        <Text style={styles.error}>{errors.email}</Text>
      )}

      <TextInput
        style={[styles.input, styles.passwordInput]}
        value={password}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
      />
      {errors.password && touched.password && (
        <Text style={styles.error}>{errors.password}</Text>
      )}

      {authError ? <Text style={styles.authError}>{authError}</Text> : null}

      {/* <Button
        color="blue"
        title="Login"
        disabled={!isFormValid}
        onPress={() => handleSubmit(email, password)}
      /> */}
      <Pressable
        style={[
          styles.loginButton,
          (!isFormValid || isLoading) && styles.disabledButton,
        ]}
        onPress={() => handleSubmit(email, password)}
        disabled={!isFormValid || isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don&apos;t have an account? Sign Up</Text>
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
    color: "#000",
  },
  passwordInput: {
    fontSize: 16,
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
  authError: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 8,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
});
