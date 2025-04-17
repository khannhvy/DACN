import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, Alert } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { markLessonAsCompleted } from "../lesson/animals";


const screenWidth = Dimensions.get("window").width;

// Định nghĩa kiểu dữ liệu
type AnimalWord = {
  word: string;
  translation: string;
  image: any;
};

const animalWords: AnimalWord[] = [
  { word: "Dog", translation: "Chó", image: require("../../assets/lesson/animal/dog.jpg") },
  { word: "Cat", translation: "Mèo", image: require("../../assets/lesson/animal/cat.jpg") },
  { word: "Sheep", translation: "Cừu", image: require("../../assets/lesson/animal/sheep.jpg") },
  { word: "Dolphin", translation: "Cá Heo", image: require("../../assets/lesson/animal/dolphin.jpg") },
  { word: "Elephant", translation: "Voi", image: require("../../assets/lesson/animal/elephant.jpg") },
  { word: "Tiger", translation: "Hổ", image: require("../../assets/lesson/animal/tiger.jpg") },
  { word: "Lion", translation: "Sư tử", image: require("../../assets/lesson/animal/lion.jpg") },
  { word: "Rabbit", translation: "Thỏ", image: require("../../assets/lesson/animal/rabbit.jpg") },
  { word: "Horse", translation: "Ngựa", image: require("../../assets/lesson/animal/horse.jpg") },
  { word: "Giraffe", translation: "Hươu cao cổ", image: require("../../assets/lesson/animal/giraffe.jpg") },
  { word: "Monkey", translation: "Khỉ", image: require("../../assets/lesson/animal/monkey.jpg") },
  { word: "Panda", translation: "Gấu trúc", image: require("../../assets/lesson/animal/panda.jpg") },
  { word: "Penguin", translation: "Chim cánh cụt", image: require("../../assets/lesson/animal/penguin.jpg") },
  { word: "Kangaroo", translation: "Chuột túi", image: require("../../assets/lesson/animal/kangaroo.jpg") },
];

export default function AnimalsAnimalsLesson() {
  const [index, setIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<AnimalWord[]>([]);
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
    const currentWord = animalWords[index];

    if (!learnedWords.some((item) => item.word === currentWord.word)) {
      setLearnedWords([...learnedWords, currentWord]);
    }

    if (index === animalWords.length - 1) {
      try {
              await markLessonAsCompleted("animal");
              Alert.alert("Completed", "You have finished the 'Animals' lesson");
            } catch (error) {
              console.error("Error marking lesson as completed:", error);
            }
      return;
    }

    setIndex(index + 1);
  };

  return (
    <TouchableWithoutFeedback >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Animals</Text>
          {/* <TouchableOpacity onPress={openMenu}>
            <Ionicons name="menu" size={32} color="#007AFF" />
          </TouchableOpacity> */}
        </View>

        <Image source={animalWords[index].image} style={styles.image} />
        <Text style={styles.word}>{animalWords[index].word}</Text>
        <Text style={styles.translation}>{animalWords[index].translation}</Text>

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* {menuVisible && (
          <TouchableWithoutFeedback onPress={closeMenu}>
            <View style={styles.overlay}>
              <Animated.View style={[styles.menu, { left: slideAnim }]}>
                <Text style={styles.menuTitle}>Từ vựng đã học</Text>
                {learnedWords.length > 0 ? (
                  learnedWords.map((item, i) => (
                    <Text key={i} style={styles.wordItem}>
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
    </TouchableWithoutFeedback>
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
  button: { backgroundColor: "#007AFF", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
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
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});