import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVsHi8njE9UXZ5y5MK7KrkJIy-_cmrQQ0",
  authDomain: "dacn-2da30.firebaseapp.com",
  projectId: "dacn-2da30",
  storageBucket: "dacn-2da30.appspot.com", 
  messagingSenderId: "292066225661",
  appId: "1:292066225661:web:9b3bfb346264d3d8e87d94",
  measurementId: "G-Q08C0CD5H9",
};

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Thiết lập Auth với AsyncStorage để giữ trạng thái đăng nhập
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db, app };
