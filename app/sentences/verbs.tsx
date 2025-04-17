import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const IrregularVerbsScreen = () => {
  const verbs = [
    { base: "be", v2: "was/were", v3: "been" },
    { base: "begin", v2: "began", v3: "begun" },
    { base: "choose", v2: "chose", v3: "chosen" },
    { base: "come", v2: "came", v3: "come" },
    { base: "do", v2: "did", v3: "done" },
    { base: "go", v2: "went", v3: "gone" },
    { base: "know", v2: "knew", v3: "known" },
    { base: "see", v2: "saw", v3: "seen" },
    { base: "take", v2: "took", v3: "taken" },
    { base: "write", v2: "wrote", v3: "written" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Irregular Verbs</Text>

      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Base Verb</Text>
          <Text style={styles.headerText}>V2</Text>
          <Text style={styles.headerText}>V3</Text>
        </View>

        {verbs.map((verb, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{verb.base}</Text>
            <Text style={styles.cell}>{verb.v2}</Text>
            <Text style={styles.cell}>{verb.v3}</Text>
          </View>
        ))}
      </View>
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
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

export default IrregularVerbsScreen;
