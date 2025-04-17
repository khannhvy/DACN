import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";


const lessons = [
  { name: "Family", path: "/lesson/family", image: require("../../assets/lesson/family.jpg") },
  { name: "Animals", path: "/lesson/animals", image: require("../../assets/lesson/animal.jpg") },
  { name: "Plants", path: "/lesson/plants", image: require("../../assets/lesson/plant.jpg") },
  { name: "Vehicles", path: "/lesson/vehicles", image: require("../../assets/lesson/vehicle.jpg") },
];

export default function LessonList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lesson</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.path}
        numColumns={2} // Hiển thị 2 cột
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(item.path)} style={styles.lessonBox}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.lessonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  row: { justifyContent: "space-between" },
  lessonBox: {
    width: "48%", // Để tránh tràn lề
    aspectRatio: 1, // Giữ tỉ lệ vuông
    backgroundColor: "#fff", // Nền trắng thay vì xanh
    borderRadius: 12, // Bo góc nhẹ
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    overflow: "hidden", // Bo góc cho cả ảnh
    borderWidth: 1, // Viền nhẹ
    borderColor: "#ddd", // Màu viền nhẹ nhàng
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%", // Ảnh phủ toàn bộ ô vuông
    height: "80%", // Giữ phần trên cho hình ảnh
    resizeMode: "cover", // Ảnh không bị méo
  },
  lessonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
  },
});
