import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  setDoc,
  doc,
  db,
  getDoc, 
} from "./firebase.js";



// Initialize Firebase Auth and Google Auth Provider
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Grab the sign-in button and input fields
let signInBtn = document.getElementById("signInBtn");
let signInEmail = document.getElementById("signInEmail");
let signInPassword = document.getElementById("signInPassword");

// Sign-in function (Email/Password)
let signIn = async () => {
  let email = signInEmail.value.trim();
  let password = signInPassword.value.trim();

  // Basic validation
  if (email === "" || password === "") {
    Swal.fire("Error", "Please fill out both fields.", "error");
    return;
  }

  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // User is authenticated but not in Firestore
      Swal.fire(
        "Error",
        "Your account is not registered. Please sign up first.",
        "error"
      );
      return;
    }

    // User exists in Firestore, proceed with login
    console.log("User logged in and data exists:", userDoc.data());
    Swal.fire("Success", "Login successful!", "success");

    // Redirect or perform any other action you want here
    setTimeout(() => {
      window.location.href = "home.html"; // Adjust the URL to your desired page
    }, 2000);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);

    // Show error to user using SweetAlert
    Swal.fire("Error", "Login failed. Please check your credentials.", "error");
  }
};

// Add event listener to the sign-in button
signInBtn.addEventListener("click", signIn);

// Google Login function
let googleBtn = document.getElementById("googleBtn");

let google = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      Swal.fire("Success", "Login successful!", "success");
      console.log("User logged in via Google: ", user);

      // Redirect or perform any other action you want here
      setTimeout(() => {
        window.location.href = "home.html"; // Adjust the URL to your desired page
      }, 2000);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(errorCode, errorMessage);

      Swal.fire(
        "Error",
        "Login failed. Please check your credentials.",
        "error"
      );
    });
};

// Add event listener to the Google login button
googleBtn.addEventListener("click", google);
