import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export const markLessonAsCompleted = async (lessonName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Người dùng chưa đăng nhập.");

  const userRef = doc(db, "User", user.uid);
  await updateDoc(userRef, {
    learnedTopics: arrayUnion(lessonName),
  });
};
