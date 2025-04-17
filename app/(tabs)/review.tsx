import React, { useContext, useEffect, useState  } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../context/ThemeContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../firebaseConfig"; 


const topics = [
  { id: "animal", title: "Animals ", icon: "paw" },
  { id: "plant", title: "Plants ", icon: "tree" },
  { id: "family", title: "Family ", icon: "users" },
  { id: "vehicle", title: "Vehicles ", icon: "car" },
  { id: "general", title: "General - vocabulary ", icon: "layer-group" },
  { id: "grammar", title: "Grammar ", icon: "book-open" },
];


export default function TopicSelectionScreen() {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);
  const [learnedTopics, setLearnedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const backgroundColor = isDarkMode ? "#121212" : "#f8f9fa";
  const cardColor = isDarkMode ? "#1e1e1e" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#333";

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
    
        // Lấy document người dùng
        const userDoc = await getDoc(doc(db, "User", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
    
        const learned = userData.learnedTopics || [];
    
        // ✅ Lấy role từ field Reference
        const roleRef = userData.Role; // Kiểu Reference
        let role = "user";
    
        if (roleRef) {
          const roleSnap = await getDoc(roleRef);
          if (roleSnap.exists()) {
            role = roleSnap.data().name || "user";
          }
        }
    
        console.log("Learned topics:", learned);
        console.log("Role:", role);
    
        setLearnedTopics(learned);
        setRole(role);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchUserData();
  }, []);
  

  const isUnlocked = (topicId) => {
    if (role === "admin") return true;
    if (topicId === "general") {
      
      // Kiểm tra nếu đã học đủ 4 chủ đề cần thiết để mở khóa "general"
      const requiredTopics = ["animal", "plant", "family", "vehicle"];
      return requiredTopics.every((id) => learnedTopics.includes(id));
    }
    return learnedTopics.includes(topicId);
  };
  

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      {/* <Text style={[styles.title, { color: textColor }]}>Chọn chủ đề kiểm tra</Text> */}

      {topics.map((topic) => {
        const unlocked = isUnlocked(topic.id);
        return (
          <TouchableOpacity
            key={topic.id}
            onPress={() => unlocked && router.push(`/test/${topic.id}`)}
            activeOpacity={unlocked ? 0.8 : 1}
            style={[
              styles.button,
              { backgroundColor: cardColor, opacity: unlocked ? 1 : 0.5 },
              !isDarkMode && styles.shadow,
            ]}
            disabled={!unlocked}
          >
            <FontAwesome5 name={topic.icon} size={26} color={unlocked ? "#007AFF" : "#999"} />
            <Text style={[styles.buttonText, { color: textColor }]}>
                {topic.title}{" "}
                {!unlocked && (
                  <FontAwesome5
                    name="lock"
                    size={16}
                    color={isDarkMode ? "#ccc" : "#999"}
                    style={{ marginLeft: 5 }}
                  />
                  )}
                </Text>
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});