import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import { db } from "../../firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface GeneralWord {
  word: string;
  translation: string;
  image: any;  
}

const generalWords: GeneralWord[] = [
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
  { word: "Coconut tree", translation: "Cây dừa", image: require("../../assets/lesson/plant/coconut_tree.jpg") },
  { word: "Banana tree", translation: "Cây chuối", image: require("../../assets/lesson/plant/banana_tree.jpg") },
  { word: "Fern", translation: "Dương xỉ", image: require("../../assets/lesson/plant/fern.jpg") },
  { word: "Maple", translation: "Cây phong", image: require("../../assets/lesson/plant/maple.jpg") },
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
].slice(0, 30);

// Cập nhật hàm getChoices với kiểu đúng cho currentQuestion
const getChoices = (currentQuestion: GeneralWord): GeneralWord[] => {
  let filteredWords = generalWords.filter(item => item.word !== currentQuestion.word);
  let choices = filteredWords.sort(() => 0.5 - Math.random()).slice(0, 3);
  choices.push(currentQuestion);
  return choices.sort(() => 0.5 - Math.random());
};

const Animals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<any[]>([]);

  const currentQuestion = generalWords[currentIndex];
  const choices = getChoices(currentQuestion);

  const saveResult = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log("Chưa đăng nhập.");
      return;
    }

    const resultData = {
      userId: user.uid,
      testName: "General Vocabulary Test",
      score: score,
      total: generalWords.length,
      timeCompleted: new Date().toISOString(),
      incorrectAnswers: incorrectAnswers.map(item => ({
        word: item.word,
        correct: item.translation,
        selected: item.selected,
      })),
    };

    try {
      // Lưu kết quả vào Firestore
      await addDoc(collection(db, "results"), resultData);
      console.log("Kết quả đã được lưu!");
    } catch (error) {
      console.error("Lỗi khi lưu kết quả:", error);
    }
  };

  useEffect(() => {
    if (currentIndex >= 30) {
      setShowResult(true);
      saveResult(); // Lưu kết quả khi hoàn thành bài kiểm tra
    }
  }, [currentIndex]); // Dependency on currentIndex change

  const handleAnswer = (selectedTranslation: string) => {
    if (selectedTranslation === currentQuestion.translation) {
      setScore(score + 1);
    } else {
      setIncorrectAnswers([...incorrectAnswers, { ...currentQuestion, selected: selectedTranslation }]);
    }

    // Tăng chỉ số câu hỏi và hiển thị kết quả khi kết thúc bài kiểm tra
    if (currentIndex + 1 < 30) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <View style={styles.container}>
      {showResult ? (
        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.resultText}>Bạn đã đúng {score} / {generalWords.length} câu!</Text>

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
  resultText: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  errorContainer: { marginTop: 20, alignItems: "center" },
  errorTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  errorItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  errorText: { fontSize: 18, marginLeft: 10, color: "black" },
});

export default Animals;
