document.querySelector('form').classList.add('loaded');

// var isLogin = JSON.parse(localStorage.getItem("uid"));
// if(isLogin) {
//   window.location.replace('./Pages/Dashboard/Dashboard.html');
// }

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC36EUn_Acs3m8Yt9NLQpcbDfDuqi82ZJ0",
  authDomain: "footwear-ab477.firebaseapp.com",
  projectId: "footwear-ab477",
  storageBucket: "footwear-ab477.appspot.com",
  messagingSenderId: "345576416470",
  appId: "1:345576416470:web:06ccb115b7f658e57b5577",
  measurementId: "G-7CE2EDQRZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to check and create user in Firestore
const checkAndCreateUser = async (user) => {
  const userRef = collection(db, "users");
  const querySnapshot = await getDocs(userRef);
  const existingUser = querySnapshot.docs.find(doc => doc.data().uid === user.uid);

  if (!existingUser) {
    console.log("User does not exist, adding to Firestore...");
    await addDoc(userRef, {
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL || "",
      displayName: user.displayName || "",
      phoneNumber: user.phoneNumber || "",
    });
    localStorage.setItem("uid", user.uid);
    alert("Sign-up successful!");
  } else {
    localStorage.setItem("uid", user.uid);
    alert("Welcome back!");}
};

// Sign-up with email and password
document.querySelector("#signUp-btn").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent form submission

  const email = document.querySelector("#exampleInputEmail1").value;
  const password = document.querySelector("#exampleInputPassword1").value;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);
    
    // Create user in Firestore if not exists
    await checkAndCreateUser(user)
    window.location.replace("./Pages/Dashboard/Dashboard.html");
    
  } catch (error) {
    console.error(`Error (${error.code}): ${error.message}`);
    alert(`Error: ${error.message}`);
  }
});

// Google sign-up
document.querySelector("#google-signUp").addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent form submission

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google sign-up successful:", user);

    // Create user in Firestore if not exists
    await checkAndCreateUser(user);

    // Wait for Firestore operation to complete before redirecting
    setTimeout(() => {
      console.log("Redirecting to Dashboard...");
      window.location.replace("./Pages/Dashboard/Dashboard.html"); // Redirect to dashboard
    }, 500);
  } catch (error) {
    console.error(`Error (${error.code}): ${error.message}`);
    alert(`Error: ${error.message}`);
  }
});
