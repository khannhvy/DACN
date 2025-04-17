import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
  { word: "Mango tree", translation: "Cây xoài", image: require("../../assets/lesson/plant/mango_tree.jpg") },
].slice(0, 10);

const getChoices = (currentQuestion: PlantWord): PlantWord[] => {
  let filteredWords = plantWords.filter(item => item.word !== currentQuestion.word);
  let choices = filteredWords.sort(() => 0.5 - Math.random()).slice(0, 3);
  choices.push(currentQuestion);
  return choices.sort(() => 0.5 - Math.random());
};

const Plants = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<any[]>([]);

  const currentQuestion = plantWords[currentIndex];
  const choices = getChoices(currentQuestion);

  const handleAnswer = (selectedTranslation: string) => {
    if (selectedTranslation === currentQuestion.translation) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => [
        ...prev,
        { ...currentQuestion, selected: selectedTranslation }
      ]);
    }

    if (currentIndex + 1 < plantWords.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
      saveResultToFirestore();
    }
  };

  const saveResultToFirestore = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const resultData = {
      userId: user.uid,
      testName: "Plant Vocabulary",
      score,
      total: plantWords.length,
      answers: incorrectAnswers,
      timeElapsed: new Date().toISOString(),
      submittedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "results"), resultData);
      console.log("✅ Kết quả đã được lưu vào Firestore");
    } catch (error) {
      console.error("❌ Lỗi khi lưu kết quả:", error);
    }
  };

  return (
    <View style={styles.container}>
      {showResult ? (
        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.resultText}>Bạn đã đúng {score} / {plantWords.length} câu!</Text>

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
                keyExtractor={(_, index) => index.toString()}
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

export default Plants;
