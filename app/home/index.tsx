import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <MaterialIcons name="language" size={80} color="#007AFF" />
      <Text style={styles.title}>Chào mừng bạn đến với LanguagePro!</Text>
      <Text style={styles.subtitle}>
        Cùng khám phá thế giới ngôn ngữ và nâng cao kỹ năng của bạn mỗi ngày.
      </Text>
      
      <Button title="Ôn tập" onPress={() => router.push("/review")} />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },
});
