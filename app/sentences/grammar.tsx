import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet,  AsyncStorage } from 'react-native';

const GrammarScreen = () => {

  const [completedLessons, setCompletedLessons] = useState([]);
  
  useEffect(() => {
    // Khi màn hình được render, lấy danh sách bài học đã hoàn thành từ AsyncStorage
    const getCompletedLessons = async () => {
      const completed = await AsyncStorage.getItem('completedLessons');
      if (completed) {
        setCompletedLessons(JSON.parse(completed));
      }
    };
    
    getCompletedLessons();
  }, []);

  // Dữ liệu ngữ pháp (ví dụ về thì hiện tại đơn)
  const grammarTopics = [
    {
      id: 1,
      title: "Danh từ (Nouns)",
      description: "Danh từ là từ dùng để chỉ người, vật, địa điểm, hoặc ý tưởng.",
      example: "She is a teacher.",
      usage: "Danh từ có thể là người (John), vật (car), địa điểm (Paris), hoặc ý tưởng (happiness).",
      note: "Danh từ có thể đếm được hoặc không đếm được.",
    },
    {
      id: 2,
      title: "Động từ (Verbs)",
      description: "Động từ là từ chỉ hành động hoặc trạng thái của chủ ngữ.",
      example: "I run every morning.",
      usage: "Động từ mô tả hành động (chạy, ăn, nói) hoặc trạng thái (là, có).",
      note: "Động từ có thể chia theo các thì và dạng.",
    },
    {
      id: 3,
      title: "Tính từ (Adjectives)",
      description: "Tính từ mô tả hoặc chỉ tính chất của danh từ.",
      example: "The sky is blue.",
      usage: "Tính từ giúp bạn mô tả đặc điểm của một đối tượng (màu sắc, kích thước, cảm xúc).",
      note: "Tính từ thường đứng trước danh từ.",
    },
    {
      id: 4,
      title: "Trạng từ (Adverbs)",
      description: "Trạng từ mô tả cách thức, thời gian, nơi chốn hoặc mức độ của hành động.",
      example: "She sings beautifully.",
      usage: "Trạng từ có thể chỉ cách thức (quickly), thời gian (today), mức độ (very), hoặc nơi chốn (here).",
      note: "Trạng từ thường đi kèm với động từ hoặc tính từ.",
    },
    {
      id: 5,
      title: "Đại từ (Pronouns)",
      description: "Đại từ là từ thay thế cho danh từ, giúp tránh lặp lại.",
      example: "He is my friend.",
      usage: "Đại từ có thể thay thế cho danh từ như 'I', 'you', 'he', 'she', 'it', 'they'.",
      note: "Có nhiều loại đại từ, bao gồm đại từ nhân xưng, đại từ sở hữu, và đại từ phản thân.",
    },
    {
      id: 6,
      title: "Giới từ (Prepositions)",
      description: "Giới từ chỉ mối quan hệ giữa danh từ hoặc đại từ với các từ khác trong câu.",
      example: "The book is on the table.",
      usage: "Giới từ giúp xác định vị trí (on, in, under) hoặc thời gian (before, after).",
      note: "Giới từ đi kèm với danh từ hoặc đại từ để tạo thành cụm giới từ.",
    },
    {
      id: 7,
      title: "Liên từ (Conjunctions)",
      description: "Liên từ nối các câu, cụm từ hoặc từ trong câu lại với nhau.",
      example: "I like tea and coffee.",
      usage: "Liên từ kết nối các từ hoặc câu (and, but, or, because).",
      note: "Liên từ giúp tạo câu phức và câu ghép.",
    },
    {
      id: 8,
      title: "Câu điều kiện (Conditionals)",
      description: "Câu điều kiện diễn tả một sự việc xảy ra nếu một điều kiện nào đó được thỏa mãn.",
      example: "If it rains, I will stay home.",
      usage: "Câu điều kiện có các loại như loại 1 (hiện tại), loại 2 (giả định), loại 3 (quá khứ).",
      note: "Cấu trúc câu điều kiện bao gồm mệnh đề if và mệnh đề chính.",
    },
    {
      id: 9,
      title: "Câu bị động (Passive Voice)",
      description: "Câu bị động diễn tả hành động được thực hiện lên chủ thể thay vì chủ thể thực hiện hành động.",
      example: "The book was read by John.",
      usage: "Câu bị động chuyển từ câu chủ động, với động từ 'be' và quá khứ phân từ.",
      note: "Câu bị động thường dùng khi không cần nhấn mạnh ai là người thực hiện hành động.",
    },
    {
      id: 10,
      title: "Câu hỏi (Questions)",
      description: "Câu hỏi dùng để yêu cầu thông tin hoặc trả lời một vấn đề.",
      example: "What time is it?",
      usage: "Câu hỏi có thể dùng từ để hỏi như 'what', 'where', 'when', 'why', 'how'.",
      note: "Câu hỏi có thể có từ để hỏi hoặc chỉ đơn giản là câu hỏi Yes/No.",
    },
  ];
  
  const markLessonAsCompleted = async (id) => {
    const newCompletedLessons = [...completedLessons, id];
    setCompletedLessons(newCompletedLessons);

    // Lưu danh sách bài học đã hoàn thành vào AsyncStorage
    await AsyncStorage.setItem('completedLessons', JSON.stringify(newCompletedLessons));
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ngữ pháp tiếng Anh</Text>
      {grammarTopics.map((grammar) => (
        <TouchableOpacity key={grammar.id} style={styles.card}>
          <Text style={styles.grammarTitle}>{grammar.title}</Text>
          <Text style={styles.grammarDescription}>{grammar.description}</Text>
          <Text style={styles.grammarExample}>Ví dụ: {grammar.example}</Text>
          <Text style={styles.grammarUsage}>Cách sử dụng: {grammar.usage}</Text>
          <Text style={styles.grammarNote}>Lưu ý: {grammar.note}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  grammarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  grammarDescription: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  grammarExample: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  grammarUsage: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  grammarNote: {
    fontSize: 14,
    color: '#555',
  },
});

export default GrammarScreen;
