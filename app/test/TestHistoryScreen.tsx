import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function TestHistoryScreen() {
  const user = auth.currentUser;
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTestResults = async () => {
      if (!user) return;

      try {
        const resultsRef = collection(db, "results");
        const q = query(resultsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        setTestResults(results);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: "/test/ResultDetailScreen",
        params: { resultId: item.id }
      })}
    >
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>{item.testName}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{item.score}/{item.total}</Text>
          </View>
        </View>
        <View style={styles.resultDetails}>
          <Text style={styles.detailText}>
            📅 {new Date(item.submittedAt?.toDate()).toLocaleDateString()}
          </Text>
          {/* <Text style={styles.detailText}>
            ⏱️ {item.timeElapsed}s
          </Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Test History</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : testResults.length > 0 ? (
        <FlatList
          data={testResults}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No test results available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  scoreContainer: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  scoreText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  resultsList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
  },
});
