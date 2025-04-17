import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useContext(ThemeContext);

  if (!theme) return null;

  const { isDarkMode } = theme;
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

  // Fetch user data to determine if the user is an admin
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth(app);
        const user = auth.currentUser;

        if (!user) {
          console.warn("Chưa đăng nhập");
          return;
        }

        const db = getFirestore(app);
        const userDoc = await getDoc(doc(db, "User", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Check if the user's role is 'admin'
        const roleRef = userData.Role;
        if (roleRef) {
          const roleSnap = await getDoc(roleRef);
          if (roleSnap.exists() && roleSnap.data().name === "admin") {
            setIsAdmin(true); // Set user as admin if role is 'admin'
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  const learningPath = [
    { id: 1, title: "Vocabulary", icon: "star", locked: false },
    { id: 2, title: "Grammar", icon: "comment-dots", locked: false },
    { id: 3, title: "Tense", icon: "clock", locked: !isAdmin }, // Admin unlocks everything
    { id: 4, title: "Irregular verbs", icon: "link", locked: !isAdmin }, // Admin unlocks everything
  ];

  const backgroundColor = isDarkMode ? "#121212" : "#f8f9fa";
  const cardColor = isDarkMode ? "#1e1e1e" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#333";

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      {/* <Text style={[styles.title, { color: textColor }]}>Lộ trình học của bạn</Text> */}

      {learningPath.map((lesson) => {
        const cardStyle = {
          backgroundColor: lesson.locked
            ? isDarkMode ? "#2c2c2c" : "#e9ecef"
            : cardColor,
          opacity: lesson.locked ? 0.6 : 1,
        };

        return (
          <TouchableOpacity
            key={lesson.id}
            style={[styles.lesson, cardStyle, !isDarkMode && styles.shadow]}
            disabled={lesson.locked}
            onPress={() => {
              switch (lesson.id) {
                case 1: router.push("/lesson"); break;
                case 2: router.push("/sentences/grammar"); break;
                case 3: router.push("/sentences/sentences1"); break;
                case 4: router.push("/sentences/verbs"); break;
              }
            }}
          >
            <FontAwesome5
              name={lesson.icon}
              size={30}
              color={lesson.locked ? "gray" : "#007AFF"}
            />
            <Text style={[
              styles.lessonText,
              { color: lesson.locked ? "gray" : textColor },
            ]}>
              {lesson.title}
            </Text>
            {lesson.locked && (
              <MaterialIcons name="lock" size={24} color="gray" />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  lesson: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  lessonText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
});
