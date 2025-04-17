import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Định nghĩa kiểu từ vựng
interface FamilyWord {
  word: string;
  translation: string;
}

// Dữ liệu từ vựng
const familyWords: FamilyWord[] = [
  { word: "Father", translation: "Bố" },
  { word: "Mother", translation: "Mẹ" },
  { word: "Son", translation: "Con trai" },
  { word: "Daughter", translation: "Con gái" },
  { word: "Grandfather", translation: "Ông" },
  { word: "Grandmother", translation: "Bà" },
  { word: "Brother", translation: "Anh/Em trai" },
  { word: "Sister", translation: "Chị/Em gái" },
  { word: "Uncle", translation: "Chú/Bác/Cậu" },
  { word: "Aunt", translation: "Cô/Dì/Bác gái" },
].slice(0, 10);

// Hàm tạo lựa chọn ngẫu nhiên
const getChoices = (currentQuestion: FamilyWord): FamilyWord[] => {
  const otherChoices = familyWords.filter(item => item.word !== currentQuestion.word);
  const choices = otherChoices.sort(() => 0.5 - Math.random()).slice(0, 3);
  choices.push(currentQuestion);
  return choices.sort(() => 0.5 - Math.random());
};

const Family = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<any[]>([]);

  const currentQuestion = familyWords[currentIndex];
  const choices = getChoices(currentQuestion);

  // Hàm lưu kết quả vào Firestore
  const saveResult = async ({ userId, testName, score, total, answers }: any) => {
    const timeElapsed = new Date().toISOString();
    try {
      await addDoc(collection(db, "results"), {
        userId,
        testName,
        score,
        total,
        answers,
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
      setIncorrectAnswers([...incorrectAnswers, {
        ...currentQuestion,
        selected: selectedTranslation
      }]);
    }

    if (currentIndex + 1 < familyWords.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setIncorrectAnswers([]);
  };

  // Lưu kết quả khi hoàn thành
  useEffect(() => {
    if (showResult) {
      const userId = getAuth().currentUser?.uid || "unknown_user";
      const testName = "Family Vocabulary Test";
      const answers = incorrectAnswers.map(item => ({
        word: item.word,
        correctAnswer: item.translation,
        selectedAnswer: item.selected,
      }));
      saveResult({ userId, testName, score, total: familyWords.length, answers });
    }
  }, [showResult]);

  return (
    <View style={styles.container}>
      {showResult ? (
        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.resultText}>
            Bạn đã đúng {score} / {familyWords.length} câu!
          </Text>

          {incorrectAnswers.length > 0 && (
            <FlatList
              key={"result"}
              data={incorrectAnswers}
              renderItem={({ item }) => (
                <View style={styles.errorItem}>
                  <Text style={styles.questionText}>Từ: {item.word}</Text>
                  <Text style={styles.errorText}>Bạn chọn: {item.selected}</Text>
                  <Text style={[styles.errorText, { color: "green" }]}>
                    Đáp án đúng: {item.translation}
                  </Text>
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          )}

          {/* <TouchableOpacity onPress={resetQuiz} style={styles.button}>
            <Text style={styles.buttonText}>Làm lại</Text>
          </TouchableOpacity> */}
        </View>
      ) : (
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.questionText}>Từ vựng: {currentQuestion.word}</Text>
          <FlatList
            key={"quiz"}
            data={choices}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAnswer(item.translation)}
                style={styles.choiceButton}
              >
                <Text style={styles.choiceText}>{item.translation}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  choiceButton: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    alignItems: "center"
  },
  choiceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  errorItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fdd",
    borderRadius: 8
  },
  errorText: {
    fontSize: 18,
    marginTop: 4
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignSelf: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default Family;
