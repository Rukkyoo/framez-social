import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { View, Text } from "react-native";

export interface FramezUser {
  uid: string;
  fullname?: string;
  username?: string;
  email: string;
  createdAt?: Date;
}

interface UserContextType {
  user: FramezUser | null;
  setUser: React.Dispatch<React.SetStateAction<FramezUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FramezUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(
            doc(db, "framez_users", firebaseUser.uid)
          );
          if (userDoc.exists()) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? "",
              ...userDoc.data(),
            } as FramezUser);
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? "",
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        // Logged out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
