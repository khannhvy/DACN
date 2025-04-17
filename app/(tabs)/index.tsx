import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";


export default function Index() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (u: User | null) => {
        if (u) {
          router.replace("/(tabs)");
        } else {
          router.replace("/login/login");
        }
        setLoading(false);
      });
      return unsubscribe;
    }, []);
  
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return null;
  }