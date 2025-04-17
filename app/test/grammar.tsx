import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const GrammarQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);//thgianlambai
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetch("http://192.168.1.83:3000/api/questions") // Thay bằng IP thật của bạn
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải câu hỏi:", error);
        setLoading(false);
      });

   // Bắt đầu đếm thời gian
   const timer = setInterval(() => {
    setTimeElapsed((prevTime) => prevTime + 1); // Tăng thời gian mỗi giây
  }, 1000);

  // Dọn dẹp khi component bị unmount
  return () => clearInterval(timer);
      }, []);

  const handleAnswer = (answer) => {
    const question = questions[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;
  
    const newAnswers = [...answers, isCorrect ? "correct" : "incorrect"];
  
    const newUserAnswers = [
      ...userAnswers,
      {
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: answer,
      },
    ];
  
    setAnswers(newAnswers);
    setUserAnswers(newUserAnswers);
  
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
      const score = newAnswers.filter((a) => a === "correct").length;
      saveResult({
        userId: user ? user.uid : "guest",
        testName: "Grammar Test",
        score,
        total: questions.length,
        answers: newUserAnswers,
        timeElapsed,
      });
    }
  };
  

  const handleRestartQuiz = () => {
    fetchQuestions();
  };



  const saveResult = async ({ userId, testName, score, total, answers }) => {
    try {
      await addDoc(collection(db, "results"), {
        userId,
        testName,
        score,
        total,
        answers, // <-- Mảng gồm câu hỏi, đáp án đúng, người dùng chọn
        timeElapsed, 
        submittedAt: serverTimestamp(),
      });
      console.log("✅ Kết quả đã được lưu vào Firestore");
    } catch (error) {
      console.error("❌ Lỗi khi lưu kết quả:", error);
    }
  };
  

  const renderQuestion = (question, index) => (
    <View key={index} style={styles.questionContainer}>
      <Text style={styles.question}>{question.question}</Text>
      {question.options.map((option, i) => (
        <TouchableOpacity key={i} style={styles.optionButton} disabled={true}>
          <Text
            style={[
              styles.optionText,
              answers[index] === "correct" && option === question.correctAnswer
                ? styles.correct
                : answers[index] === "incorrect" && option === question.correctAnswer
                ? styles.correct
                : answers[index] === "incorrect" && option !== question.correctAnswer
                ? styles.incorrect
                : {},
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
      <Text
        style={[
          styles.feedback,
          answers[index] === "correct"
            ? styles.correctFeedback
            : styles.incorrectFeedback,
        ]}
      >
        {answers[index] === "correct"
          ? question.feedback
          : `Sai rồi! Đáp án đúng là: ${question.correctAnswer}.`}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải câu hỏi...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Không có câu hỏi nào.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bài kiểm tra ngữ pháp</Text>

      {!quizComplete ? (
        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            Câu {currentQuestionIndex + 1}/{questions.length}
          </Text>
          <Text style={styles.question}>{questions[currentQuestionIndex].question}</Text>
          {questions[currentQuestionIndex].options.map((option, i) => (
            <TouchableOpacity
              key={i}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <>
          {questions.map((question, index) => renderQuestion(question, index))}
          <Text style={styles.finalScore}>
            Bạn đã trả lời {answers.filter((a) => a === "correct").length} / {questions.length} câu đúng!
          </Text>

          {/* <TouchableOpacity onPress={handleRestartQuiz} style={styles.restartButton}>
            <Text style={styles.restartText}>Làm lại</Text>
          </TouchableOpacity> */}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 5,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  correct: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  incorrect: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  feedback: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
  correctFeedback: {
    color: "#28a745",
  },
  incorrectFeedback: {
    color: "#dc3545",
  },
  finalScore: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  restartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GrammarQuiz;