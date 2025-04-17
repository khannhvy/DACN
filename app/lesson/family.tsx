import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, Alert } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { markLessonAsCompleted } from "../lesson/family";
import React from 'react';

const screenWidth = Dimensions.get("window").width;

type WordType = {
  word: string;
  translation: string;
  image: any;
};

const familyWords: WordType[] = [
  { word: "Father", translation: "Bố", image: require("../../assets/lesson/family/father.jpg") },
  { word: "Mother", translation: "Mẹ", image: require("../../assets/lesson/family/mother.jpg") },
  { word: "Son", translation: "Con trai", image: require("../../assets/lesson/family/son.jpg") },
  { word: "Daughter", translation: "Con gái", image: require("../../assets/lesson/family/daughter.jpg") },
  { word: "Grandfather", translation: "Ông", image: require("../../assets/lesson/family/grandfather.jpg") },
  { word: "Grandmother", translation: "Bà", image: require("../../assets/lesson/family/grandmother.jpg") },
  { word: "Brother", translation: "Anh/Em trai", image: require("../../assets/lesson/family/brother.jpg") },
  { word: "Sister", translation: "Chị/Em gái", image: require("../../assets/lesson/family/sister.jpg") },
  { word: "Uncle", translation: "Chú/Bác/Cậu", image: require("../../assets/lesson/family/uncle.jpg") },
  { word: "Aunt", translation: "Cô/Dì/Bác gái", image: require("../../assets/lesson/family/aunt.jpg") },
  { word: "Cousin", translation: "Anh/Chị/Em họ", image: require("../../assets/lesson/family/cousin.jpg") },
  { word: "Nephew", translation: "Cháu trai", image: require("../../assets/lesson/family/nephew.jpg") },
  { word: "Niece", translation: "Cháu gái", image: require("../../assets/lesson/family/niece.jpg") },
  { word: "Husband", translation: "Chồng", image: require("../../assets/lesson/family/husband.jpg") },
  { word: "Wife", translation: "Vợ", image: require("../../assets/lesson/family/wife.jpg") },
];

export default function FamilyLesson() {
  const [index, setIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<WordType[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  // const openMenu = () => {
  //   setMenuVisible(true);
  //   Animated.timing(slideAnim, {
  //     toValue: screenWidth - 200,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();
  // };

  // const closeMenu = () => {
  //   Animated.timing(slideAnim, {
  //     toValue: screenWidth,
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start(() => setMenuVisible(false));
  // };

  const handleNext = async () => {
    const currentWord = familyWords[index];
  
    // Thêm từ đang học vào danh sách nếu chưa có
    if (!learnedWords.some((item) => item.word === currentWord.word)) {
      setLearnedWords([...learnedWords, currentWord]);
    }
  
    // Kiểm tra nếu đã đến từ cuối cùng
    if (index === familyWords.length - 1) {
      try {
        await markLessonAsCompleted("family");
        Alert.alert("Completed", "You have finished the 'Family' lesson");
      } catch (error) {
        console.error("Error marking lesson as completed:", error);
      }
      return; // Không cho học tiếp
    }
  
    // Tăng index nếu chưa phải từ cuối
    setIndex(index + 1);
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family</Text>
        {/* <TouchableOpacity onPress={openMenu}>
          <Ionicons name="menu" size={32} color="#007AFF" />
        </TouchableOpacity> */}
      </View>

      {/* Hình ảnh và từ vựng */}
      <Image source={familyWords[index].image} style={styles.image} />
      <Text style={styles.word}>{familyWords[index].word}</Text>
      <Text style={styles.translation}>{familyWords[index].translation}</Text>

      {/* Nút tiếp tục */}
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      {/* Menu hiển thị từ đã học */}
      {/* {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.menu, { left: slideAnim }]}>
              <Text style={styles.menuTitle}>Từ vựng đã học</Text>
              {learnedWords.length > 0 ? (
                learnedWords.map((item, idx) => (
                  <Text key={idx} style={styles.wordItem}>
                    {item.word} - {item.translation}
                  </Text>
                ))
              ) : (
                <Text style={styles.wordItem}>Chưa có từ nào được học.</Text>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#007AFF" },
  image: { width: 250, height: 250, resizeMode: "contain", marginBottom: 20 },
  word: { fontSize: 24, fontWeight: "bold", color: "#007AFF", marginBottom: 5 },
  translation: { fontSize: 20, color: "#333", marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.2)", // làm mờ nền
  },

  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 200,
    backgroundColor: "#fff",
    padding: 20,
    borderLeftWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: -2, height: 0 },
    elevation: 5,
  },
  menuTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#007AFF" },
  wordItem: { fontSize: 18, marginBottom: 8, color: "#333" },
});