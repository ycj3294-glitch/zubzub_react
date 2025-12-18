// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "zubzub-bc944.firebaseapp.com",
  projectId: "zubzub-bc944",
  storageBucket: "zubzub-bc944.firebasestorage.app",
  messagingSenderId: "2133841490",
  appId: "1:2133841490:web:8d9b7cb95fa1d724f6718b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = async (file) => {
  const storageRef = ref(storage, file.name);
  if (!(await uploadBytes(storageRef, file))) return;
  console.log("Uploaded a file!");
  return await getDownloadURL(storageRef);
};
