import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 


interface AnimalWord {
  word: string;
  translation: string;
  image: any;  
}

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
].slice(0, 10);

// Cập nhật hàm getChoices với kiểu đúng cho currentQuestion
const getChoices = (currentQuestion: AnimalWord): AnimalWord[] => {
  let filteredWords = animalWords.filter(item => item.word !== currentQuestion.word);
  let choices = filteredWords.sort(() => 0.5 - Math.random()).slice(0, 3);
  choices.push(currentQuestion);
  return choices.sort(() => 0.5 - Math.random());
};

const Animals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<any[]>([]);  // Nhập cho câu trả lời incorrectAnswers

  const currentQuestion = animalWords[currentIndex];
  const choices = getChoices(currentQuestion);

  // Hàm lưu kết quả vào Firestore
  const saveResult = async ({ userId, testName, score, total, answers }: any) => {
    const timeElapsed = new Date().toISOString(); // Tính thời gian kết thúc
    try {
      await addDoc(collection(db, "results"), {
        userId,
        testName,
        score,
        total,
        answers, // Mảng gồm câu hỏi, đáp án đúng, người dùng chọn
        timeElapsed, 
        submittedAt: serverTimestamp(),
      });
      console.log("✅ Kết quả đã được lưu vào Firestore");
    } catch (error) {
      console.error("❌ Lỗi khi lưu kết quả:", error);
    }
  };

  const handleAnswer = (selectedTranslation: string) => {
    if (selectedTranslation === currentQuestion.translation) {
      setScore(score + 1);
    } else {
      setIncorrectAnswers([...incorrectAnswers, { ...currentQuestion, selected: selectedTranslation }]);
    }
  
    if (currentIndex + 1 < 10) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  // Khi bài kiểm tra kết thúc, lưu kết quả vào Firestore
  if (showResult) {
    const userId = getAuth().currentUser?.uid || "unknown_user"; // Lấy userId từ Firebase Auth
    const testName = "Animal Vocabulary Test"; // Tên bài kiểm tra
    const answers = incorrectAnswers.map(item => ({
      word: item.word,
      correctAnswer: item.translation,
      selectedAnswer: item.selected,
    }));
    saveResult({ userId, testName, score, total: animalWords.length, answers });
  }

  return (
    <View style={styles.container}>
      {showResult ? (
        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.resultText}>Bạn đã đúng {score} / {animalWords.length} câu!</Text>

          {incorrectAnswers.length > 0 && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Các câu trả lời sai:</Text>
              <FlatList
                data={incorrectAnswers}
                renderItem={({ item }) => (
                  <View style={styles.errorItem}>
                    <Image source={item.image} style={{ width: 50, height: 50, borderRadius: 5 }} />
                    <Text style={styles.errorText}>
                      {item.word} ({item.translation}) → Bạn chọn: {item.selected}
                    </Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}

          {/* <TouchableOpacity onPress={() => {
            setCurrentIndex(0);
            setScore(0);
            setIncorrectAnswers([]);
            setShowResult(false);
          }} style={styles.button}>
            <Text style={styles.buttonText}>Làm lại</Text>
          </TouchableOpacity> */}
        </View>
      ) : (
        <View>
          <Text style={styles.questionText}>Từ vựng: {currentQuestion.word}</Text>
          <FlatList
            data={choices}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAnswer(item.translation)} style={styles.imageButton}>
                <Image source={item.image} style={styles.image} />
              </TouchableOpacity>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            style={styles.imageContainer}
          />
        </View>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const imageSize = (screenWidth / 2) - 30;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  questionText: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  imageContainer: { width: "100%", marginBottom: 20 },
  imageButton: { 
    width: imageSize, 
    height: imageSize, 
    margin: 10, 
    justifyContent: "center",
    alignItems: "center"
  },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  button: { backgroundColor: "#4CAF50", padding: 12, marginTop: 20, borderRadius: 5 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  resultText: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  errorContainer: { marginTop: 20, alignItems: "center" },
  errorTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  errorItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  errorText: { fontSize: 18, marginLeft: 10, color: "red" },
});

export default Animals;
