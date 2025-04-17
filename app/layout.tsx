import { useState, useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    console.log("Firebase Auth Instance:", auth); // 👀 Kiểm tra Firebase có hoạt động không

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User state changed:", user); // 👀 Kiểm tra user có null không
      setUser(user);
      setLoading(false);

      if (!user) {
        console.log("Redirecting to login..."); // 👀 Kiểm tra có chạy lệnh router.replace không
        router.replace("/login/login");
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Slot />; // ⚡ Hiển thị màn hình tương ứng
}
