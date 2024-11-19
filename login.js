import { getAuth, signInWithEmailAndPassword } from "./firebase.js";

// Grab the sign-in button and input fields
let signInBtn = document.getElementById("signInBtn");
let signInEmail = document.getElementById("signInEmail");
let signInPassword = document.getElementById("signInPassword");

// Sign-in function
let signIn = () => {
  let email = signInEmail.value.trim();
  let password = signInPassword.value.trim();

  // Basic validation
  if (email === "" || password === "") {
    Swal.fire("Error", "Please fill out both fields.", "error");
    return;
  }

  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log("User logged in: ", user);
      Swal.fire("Success", "Login successful!", "success");

      // Redirect or perform any other action you want here
      setTimeout(() => {
        window.location.href = "home.html"; // Adjust the URL to your desired page
      }, 2000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);

      // Show error to user using SweetAlert
      Swal.fire(
        "Error",
        "Login failed. Please check your credentials.",
        "error"
      );
    });
};

// Add event listener to the sign-in button
signInBtn.addEventListener("click", signIn);



