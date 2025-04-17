import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface VehicleWord {
  word: string;
  translation: string;
  image: any;
}

const vehicleWords: VehicleWord[] = [
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
].slice(0, 10);

const getChoices = (currentQuestion: VehicleWord): VehicleWord[] => {
  let filtered = vehicleWords.filter(item => item.word !== currentQuestion.word);
  let choices = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
  choices.push(currentQuestion);
  return choices.sort(() => 0.5 - Math.random());
};

const Vehicles = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<any[]>([]);

  const currentQuestion = vehicleWords[currentIndex];
  const choices = getChoices(currentQuestion);

  const handleAnswer = (selectedTranslation: string) => {
    if (selectedTranslation === currentQuestion.translation) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => [
        ...prev,
        {
          ...currentQuestion,
          selected: selectedTranslation,
        },
      ]);
    }

    if (currentIndex + 1 < vehicleWords.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
      saveResult();
    }
  };

  const saveResult = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("Chưa đăng nhập, không thể lưu kết quả.");
      return;
    }

    try {
      await addDoc(collection(db, "results"), {
        userId: user.uid,
        testName: "Vehicle Vocabulary",
        score,
        total: vehicleWords.length,
        answers: incorrectAnswers,
        timeElapsed: new Date().toISOString(),
        submittedAt: serverTimestamp(),
      });
      console.log("✅ Kết quả đã được lưu vào Firestore");
    } catch (error) {
      console.error("❌ Lỗi khi lưu kết quả:", error);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setIncorrectAnswers([]);
    setShowResult(false);
  };

  return (
    <View style={styles.container}>
      {showResult ? (
        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.resultText}>Bạn đã đúng {score} / {vehicleWords.length} câu!</Text>

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

          {/* <TouchableOpacity onPress={restartQuiz} style={styles.button}>
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
            keyExtractor={(_, index) => index.toString()}
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

export default Vehicles;
