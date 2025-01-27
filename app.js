
// Check if you're on the login page
document.addEventListener('DOMContentLoaded', function() {
  // Check if uid exists in local storage
  const uid = localStorage.getItem('uid');
  if (uid && !sessionStorage.getItem('redirected')) {
    // Set a flag in session storage to prevent repeated redirection
    sessionStorage.setItem('redirected', 'true');
    // Redirect to the dashboard page using an absolute path
    window.location.replace("/Pages/Dashboard/Dashboard.html");
  }
});




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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export auth
export { auth };

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
    alert("Welcome back!");
  }
};

// Check if you're on the login page
document.addEventListener('DOMContentLoaded', function() {
  if (document.body.id === 'login-page') {
    const form = document.querySelector('form');
    if (form) {
      // Ensure the form is visible immediately after the DOM loads
      form.classList.add('loaded'); // Instantly make the form visible
    }
  }

  // Dashboard-specific code
  if (document.body.id === 'dashboard-page') {
    console.log('Welcome to the dashboard!');
  }

  // Sign-up with email and password
  const signUpBtn = document.getElementById("signUp-btn");
  if (signUpBtn) {
    signUpBtn.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent form submission

      const email = document.querySelector("#exampleInputEmail1").value;
      const password = document.querySelector("#exampleInputPassword1").value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User created:", user);

        // Create user in Firestore if not exists
        await checkAndCreateUser(user);
        window.location.replace("./Pages/Dashboard/Dashboard.html");

      } catch (error) {
        console.error(`Error (${error.code}): ${error.message}`);
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Google sign-up
  const googleSignUpBtn = document.getElementById("google-signUp");
  if (googleSignUpBtn) {
    googleSignUpBtn.addEventListener("click", async (event) => {
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
  }
});
