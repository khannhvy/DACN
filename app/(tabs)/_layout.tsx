import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; 
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";

function TabLayout() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    return null; 
  }

  const { isDarkMode } = theme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#222" : "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "Review",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="auto-stories" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: "User",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, 
        }}
/>

    </Tabs>
  );
}

export default function LayoutWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <ThemeProvider>
        <TabLayout />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
