import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useEffect, useState } from "react";

export default function ResultDetailScreen() {
  const { resultId } = useLocalSearchParams(); 
  const [result, setResult] = useState(null);  
  const [error, setError] = useState(null);    

  useEffect(() => {
    const fetchResultDetail = async () => {
      try {
        const docRef = doc(db, "results", resultId); 
        const docSnap = await getDoc(docRef);  

        if (docSnap.exists()) {  
          setResult(docSnap.data());  
        } else {
          setError("Result not found."); 
        }
      } catch (e) {
        console.error("Error fetching detail:", e);  
        setError("An error occurred while loading data.");
      }
    };

    if (resultId) {
      fetchResultDetail();  
    }
  }, [resultId]);  

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Result Details</Text>
      <FlatList
        data={result.answers}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.questionCard}>
            {item.word && item.correctAnswer && item.selectedAnswer ? (
              <View>
                <Text style={styles.questionText}>
                  {index + 1}. {item.word}
                </Text>
                <Text style={styles.answerText}>
                  Correct Answer: <Text style={styles.bold}>{item.correctAnswer}</Text>
                </Text>
                <Text style={styles.answerText}>
                  Your Answer: <Text style={styles.userAnswer}>{item.selectedAnswer}</Text>
                </Text>
              </View>
            ) : item.question ? (
              <View>
                <Text style={styles.questionText}>
                  {index + 1}. {item.question}
                </Text>
                <Text style={styles.answerText}>
                  Correct Answer: <Text style={styles.bold}>{item.correctAnswer}</Text>
                </Text>
                <Text style={styles.answerText}>
                  Your Answer: <Text style={styles.userAnswer}>{item.userAnswer}</Text>
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.questionText}>
                  {index + 1}. {item.word}
                </Text>
                <Text style={styles.answerText}>
                  Correct Answer: <Text style={styles.bold}>{item.translation}</Text>
                </Text>
                <Text style={styles.answerText}>
                  Your Answer: <Text style={styles.userAnswer}>{item.selected}</Text>
                </Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9fb",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  questionCard: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#222",
  },
  answerText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
    color: "#2c7be5",
  },
  userAnswer: {
    fontWeight: "bold",
    color: "#e55353",
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
  },
});
