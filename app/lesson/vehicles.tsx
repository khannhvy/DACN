import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, Alert } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { markLessonAsCompleted } from "../lesson/vehicles";
import React from 'react';

const screenWidth = Dimensions.get("window").width;

interface vehicleWords {
  word: string;
  translation: string;
  image: any;
}

const vehicleWords = [
  { word: "Car", translation: "Xe hơi", image: require("../../assets/lesson/vehicle/car.jpg") },
  { word: "Airplane", translation: "Máy bay", image: require("../../assets/lesson/vehicle/airplane.jpg") },
  { word: "Train", translation: "Tàu hỏa", image: require("../../assets/lesson/vehicle/train.jpg") },
  { word: "Bicycle", translation: "Xe đạp", image: require("../../assets/lesson/vehicle/bicycle.jpg") },
  { word: "Motorbike", translation: "Xe máy", image: require("../../assets/lesson/vehicle/motorbike.png") },
  { word: "Bus", translation: "Xe buýt", image: require("../../assets/lesson/vehicle/bus.jpg") },
  { word: "Truck", translation: "Xe tải", image: require("../../assets/lesson/vehicle/truck.jpg") },
  { word: "Boat", translation: "Thuyền", image: require("../../assets/lesson/vehicle/boat.jpg") },
  { word: "Helicopter", translation: "Trực thăng", image: require("../../assets/lesson/vehicle/helicopter.jpg") },
  { word: "Subway", translation: "Tàu điện ngầm", image: require("../../assets/lesson/vehicle/subway.jpg") },
  { word: "Ship", translation: "Tàu thủy", image: require("../../assets/lesson/vehicle/ship.jpg") },
  { word: "Scooter", translation: "Xe tay ga", image: require("../../assets/lesson/vehicle/scooter.jpg") },
  { word: "Ambulance", translation: "Xe cứu thương", image: require("../../assets/lesson/vehicle/ambulance.jpg") },
  { word: "Fire truck", translation: "Xe cứu hỏa", image: require("../../assets/lesson/vehicle/fire_truck.jpg") },
];


export default function VehicleLesson() {
  const [index, setIndex] = useState(0);
  const [learnedWords, setLearnedWords] = useState<vehicleWords[]>([]);
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
    const currentWord = vehicleWords[index];

    if (!learnedWords.some((item) => item.word === currentWord.word)) {
      setLearnedWords([...learnedWords, currentWord]);
    }

    if (index === vehicleWords.length - 1) {
      try {
              await markLessonAsCompleted("vehicle");
              Alert.alert("Completed", "You have finished the 'Vehicles' lesson");
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
          <Text style={styles.headerTitle}>Vehicles</Text>
          {/* <TouchableOpacity onPress={openMenu}>
            <Ionicons name="menu" size={32} color="#007AFF" />
          </TouchableOpacity> */}
        </View>

        <Image source={vehicleWords[index].image} style={styles.image} />
        <Text style={styles.word}>{vehicleWords[index].word}</Text>
        <Text style={styles.translation}>{vehicleWords[index].translation}</Text>

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