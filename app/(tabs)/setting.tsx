import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { ThemeContext } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const router = useRouter();
  const user = auth.currentUser;

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const goToUpdateInfo = () => {
    router.push("/login/update-info");
  };

  const goToTestHistory = () => {
    router.push("/test/TestHistoryScreen"); 
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        if (user) {
          const docRef = doc(db, "User", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInfo({
              name: data.FullName || "",
              phone: data.Phone || "",
              email: user.email || "",
            });
          }
        }
      };
      fetchUserInfo();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed out");
      router.replace("/login/login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" }]}>
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: isDarkMode ? "#333" : "#ddd" }]}>
          <Text style={[styles.avatarText, { color: isDarkMode ? "#fff" : "#555" }]}>
            {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDarkMode ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>Personal Information</Text>
        
        <View style={styles.infoRow}>
          <Icon name="person" size={20} color={isDarkMode ? "#aaa" : "#666"} />
          <Text style={[styles.infoText, { color: isDarkMode ? "#fff" : "#333" }]}>{userInfo.name || "Not updated"}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="email" size={20} color={isDarkMode ? "#aaa" : "#666"} />
          <Text style={[styles.infoText, { color: isDarkMode ? "#fff" : "#333" }]}>{userInfo.email || "Not updated"}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color={isDarkMode ? "#aaa" : "#666"} />
          <Text style={[styles.infoText, { color: isDarkMode ? "#fff" : "#333" }]}>{userInfo.phone || "Not updated"}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: isDarkMode ? "#1e1e1e" : "#fff" }]}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#333" }]}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push("/login/change-password")}
        >
          <View style={styles.menuItemLeft}>
            <Icon name="lock" size={22} color="#4A90E2" />
            <Text style={[styles.menuItemText, { color: isDarkMode ? "#fff" : "#333" }]}>Change Password</Text>
          </View>
          <Icon name="chevron-right" size={22} color={isDarkMode ? "#666" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={goToUpdateInfo}>
          <View style={styles.menuItemLeft}>
            <Icon name="edit" size={22} color="#4A90E2" />
            <Text style={[styles.menuItemText, { color: isDarkMode ? "#fff" : "#333" }]}>Update Profile</Text>
          </View>
          <Icon name="chevron-right" size={22} color={isDarkMode ? "#666" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={goToTestHistory}>
          <View style={styles.menuItemLeft}>
            <Icon name="history" size={22} color="#4A90E2" />
            <Text style={[styles.menuItemText, { color: isDarkMode ? "#fff" : "#333" }]}>Test History</Text>
          </View>
          <Icon name="chevron-right" size={22} color={isDarkMode ? "#666" : "#999"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: "#ff4444" }]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    marginLeft: 12,
  },
  logoutButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
