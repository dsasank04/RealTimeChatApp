import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "realchatapp-94ed3.firebaseapp.com",
  projectId: "realchatapp-94ed3",
  storageBucket: "realchatapp-94ed3.appspot.com",
  messagingSenderId: "703378074557",
  appId: "1:703378074557:web:f539a5b1cf805c3b4cc0d4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

export const deleteMessage = async (chatId, message) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    messages: arrayRemove(message),
  });

  // Delete associated file from storage if it exists
  if (message.img || message.audio) {
    const fileUrl = message.img || message.audio;
    const fileRef = ref(storage, fileUrl);

    try {
      await deleteObject(fileRef);
      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }
};
