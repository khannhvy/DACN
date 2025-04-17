import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GrammarScreen = () => {
  // Dữ liệu ngữ pháp (ví dụ về thì hiện tại đơn)
  const grammarData = [
    {
      id: 1,
      title: "Thì hiện tại đơn (Present Simple)",
      description:
        "Thì hiện tại đơn dùng để diễn tả một hành động xảy ra thường xuyên, là sự thật hiển nhiên, hoặc sự kiện xảy ra trong hiện tại.",
      example: "I go to school every day.",
      usage: "Diễn tả thói quen, sự thật hiển nhiên.",
      note: "Dùng với các động từ 'do/does' trong câu phủ định và câu hỏi.",
    },
    {
      id: 2,
      title: "Thì hiện tại tiếp diễn (Present Continuous)",
      description:
        "Thì hiện tại tiếp diễn dùng để diễn tả hành động đang diễn ra tại thời điểm nói.",
      example: "I am reading a book right now.",
      usage: "Diễn tả hành động đang xảy ra ở hiện tại.",
      note: "Dùng với 'am/are/is + V-ing'.",
    },
    {
      id: 3,
      title: "Thì hiện tại hoàn thành (Present Perfect)",
      description:
        "Thì hiện tại hoàn thành diễn tả hành động đã xảy ra trong quá khứ và vẫn có liên quan đến hiện tại.",
      example: "I have seen that movie before.",
      usage: "Diễn tả hành động đã hoàn thành trong quá khứ nhưng có ảnh hưởng đến hiện tại.",
      note: "Dùng với 'have/has + past participle'.",
    },
    {
      id: 4,
      title: "Thì hiện tại hoàn thành tiếp diễn (Present Perfect Continuous)",
      description:
        "Thì hiện tại hoàn thành tiếp diễn diễn tả hành động bắt đầu trong quá khứ và kéo dài đến hiện tại, thường nhấn mạnh tính liên tục của hành động.",
      example: "I have been studying for two hours.",
      usage: "Diễn tả hành động bắt đầu trong quá khứ và vẫn tiếp diễn.",
      note: "Dùng với 'have/has been + V-ing'.",
    },
    {
      id: 5,
      title: "Thì quá khứ đơn (Past Simple)",
      description:
        "Thì quá khứ đơn dùng để diễn tả một hành động đã xảy ra và hoàn thành trong quá khứ.",
      example: "I visited London last year.",
      usage: "Diễn tả hành động đã hoàn thành trong quá khứ.",
      note: "Dùng với động từ dạng quá khứ, nếu là động từ bất quy tắc thì dùng dạng quá khứ của động từ đó.",
    },
    {
      id: 6,
      title: "Thì quá khứ tiếp diễn (Past Continuous)",
      description:
        "Thì quá khứ tiếp diễn diễn tả hành động đang diễn ra tại một thời điểm cụ thể trong quá khứ.",
      example: "I was reading a book when he called.",
      usage: "Diễn tả hành động đang xảy ra tại một thời điểm trong quá khứ.",
      note: "Dùng với 'was/were + V-ing'.",
    },
    {
      id: 7,
      title: "Thì quá khứ hoàn thành (Past Perfect)",
      description:
        "Thì quá khứ hoàn thành diễn tả một hành động đã xảy ra và hoàn thành trước một hành động khác trong quá khứ.",
      example: "I had finished my homework before I went out.",
      usage: "Diễn tả hành động đã hoàn thành trước một hành động khác trong quá khứ.",
      note: "Dùng với 'had + past participle'.",
    },
    {
      id: 8,
      title: "Thì quá khứ hoàn thành tiếp diễn (Past Perfect Continuous)",
      description:
        "Thì quá khứ hoàn thành tiếp diễn diễn tả hành động đã bắt đầu trước một thời điểm trong quá khứ và kéo dài cho đến khi hành động đó bị cắt đứt bởi một hành động khác trong quá khứ.",
      example: "I had been studying for two hours before the test started.",
      usage: "Diễn tả hành động đã bắt đầu trước một thời điểm trong quá khứ và vẫn tiếp diễn.",
      note: "Dùng với 'had been + V-ing'.",
    },
    {
      id: 9,
      title: "Thì tương lai đơn (Future Simple)",
      description:
        "Thì tương lai đơn diễn tả hành động sẽ xảy ra trong tương lai.",
      example: "I will go to the market tomorrow.",
      usage: "Diễn tả hành động sẽ xảy ra trong tương lai.",
      note: "Dùng với 'will + V'.",
    },
    {
      id: 10,
      title: "Thì tương lai tiếp diễn (Future Continuous)",
      description:
        "Thì tương lai tiếp diễn diễn tả hành động sẽ đang diễn ra tại một thời điểm cụ thể trong tương lai.",
      example: "I will be studying at 7 PM tomorrow.",
      usage: "Diễn tả hành động sẽ diễn ra tại một thời điểm trong tương lai.",
      note: "Dùng với 'will be + V-ing'.",
    },
    {
      id: 11,
      title: "Thì tương lai hoàn thành (Future Perfect)",
      description:
        "Thì tương lai hoàn thành diễn tả hành động sẽ hoàn thành trước một thời điểm hoặc sự kiện nào đó trong tương lai.",
      example: "I will have finished my homework by 8 PM.",
      usage: "Diễn tả hành động sẽ hoàn thành trước một thời điểm trong tương lai.",
      note: "Dùng với 'will have + past participle'.",
    },
    {
      id: 12,
      title: "Thì tương lai hoàn thành tiếp diễn (Future Perfect Continuous)",
      description:
        "Thì tương lai hoàn thành tiếp diễn diễn tả hành động sẽ tiếp diễn cho đến một thời điểm trong tương lai và nhấn mạnh tính liên tục của hành động đó.",
      example: "By next year, I will have been working here for 10 years.",
      usage: "Diễn tả hành động sẽ tiếp diễn cho đến một thời điểm trong tương lai.",
      note: "Dùng với 'will have been + V-ing'.",
    },
  ];
  
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ngữ pháp tiếng Anh</Text>
      {grammarData.map((grammar) => (
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
