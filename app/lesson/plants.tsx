import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, Alert } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { markLessonAsCompleted } from "../lesson/plants";

const screenWidth = Dimensions.get("window").width;

interface PlantWord {
  word: string;
  translation: string;
  image: any;
}

const plantWords: PlantWord[] = [
  { word: "Sunflower", translation: "Hoa hướng dương", image: require("../../assets/lesson/plant/sunflower.jpg") },
  { word: "Bamboo", translation: "Tre", image: require("../../assets/lesson/plant/bamboo.jpg") },
  { word: "Rose", translation: "Hoa hồng", image: require("../../assets/lesson/plant/rose.jpg") },
  { word: "Lotus", translation: "Hoa sen", image: require("../../assets/lesson/plant/lotus.jpg") },
  { word: "Orchid", translation: "Hoa lan", image: require("../../assets/lesson/plant/orchid.jpg") },
  { word: "Daisy", translation: "Hoa cúc", image: require("../../assets/lesson/plant/daisy.jpg") },
  { word: "Tulip", translation: "Hoa tulip", image: require("../../assets/lesson/plant/tulip.jpg") },
  { word: "Cactus", translation: "Xương rồng", image: require("../../assets/lesson/plant/cactus.jpg") },
  { word: "Pine", translation: "Cây thông", image: require("../../assets/lesson/plant/pine.jpg") },
  { word: "Mango", translation: "Xoài", image: require("../../assets/lesson/plant/mango_tree.jpg") },
  { word: "Coconut", translation: "Dừa", image: require("../../assets/lesson/plant/coconut_tree.jpg") },
  { word: "Banana", translation: "Chuối", image: require("../../assets/lesson/plant/banana_tree.jpg") },
  { word: "Fern", translation: "Dương xỉ", image: require("../../assets/lesson/plant/fern.jpg") },
  { word: "Maple", translation: "Cây phong", image: require("../../assets/lesson/plant/maple.jpg") },
];


export default function PlantLesson() {
  const [index, setIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<PlantWord[]>([]);
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
    const currentWord = plantWords[index];

    if (!learnedWords.some((item) => item.word === currentWord.word)) {
      setLearnedWords([...learnedWords, currentWord]);
    }

    if (index === plantWords.length - 1) {
      try {
        await markLessonAsCompleted("plant");
        Alert.alert("Completed", "You have finished the 'Plant' lesson");
      } catch (error) {
        console.error("Error marking lesson as completed:", error);
      }
      return;
    }

    setIndex(index + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plant</Text>
        {/* <TouchableOpacity onPress={openMenu}>
          <Ionicons name="menu" size={32} color="#28a745" />
        </TouchableOpacity> */}
      </View>

      <Image source={plantWords[index].image} style={styles.image} />
      <Text style={styles.word}>{plantWords[index].word}</Text>
      <Text style={styles.translation}>{plantWords[index].translation}</Text>

      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      {/* {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.menu, { left: slideAnim }]}>
              <Text style={styles.menuTitle}>Learned Words</Text>
              {learnedWords.length > 0 ? (
                learnedWords.map((item, idx) => (
                  <Text key={idx} style={styles.wordItem}>
                    {item.word} - {item.translation}
                  </Text>
                ))
              ) : (
                <Text style={styles.wordItem}>No words learned yet.</Text>
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