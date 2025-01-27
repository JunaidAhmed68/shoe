  const uid = localStorage.getItem("uid");

  if (!uid) {
    // User is not logged in, redirect to login page
    console.log("Access denied. Redirecting to Login...");
    window.location.replace("../../index.html");
  }
import { signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "../../app.js";
document.querySelector("#signOut").addEventListener("click", async () => {
  try {
    await signOut(auth); // Sign out from Firebase
    localStorage.removeItem("uid"); // Remove 'uid' from local storage
    alert("User signed out and local storage cleared.")
    window.location.replace("../../index.html"); // Redirect to login page
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
});
