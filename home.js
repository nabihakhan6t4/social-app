import {
  getAuth,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from "./firebase.js";

const auth = getAuth();

// Check if user came from signup
const urlParams = new URLSearchParams(window.location.search);
const isFromSignup = urlParams.get("from") === "signup";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    if (!user.emailVerified) {
      // Restrict access if email is not verified
      Swal.fire({
        title: "Access Denied",
        text: "Your email is not verified. Please verify your email to proceed.",
        icon: "error",
      }).then(() => {
        sendEmailVerification(user)
          .then(() => {
            Swal.fire({
              title: "Verification Sent",
              text: "A verification email has been sent to your inbox. Please verify to continue.",
              icon: "success",
            }).then(() => {
              auth.signOut(); // Log the user out
              window.location.href = "./login.html"; // Redirect to login page
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: `Failed to send verification email: ${error.message}`,
              icon: "error",
            });
          });
      });
    } else {
      // Email is verified
      if (isFromSignup) {
        // Signup Case
        Swal.fire({
          title: "Welcome!",
          text: "Your email is verified. Enjoy using our app!",
          icon: "success",
        });
      } else {
        // Login Case
        Swal.fire({
          title: "Welcome Back!",
          text: "You are successfully logged in.",
          icon: "success",
        });
      }
      console.log("User is signed in and email is verified. Proceeding to home page.");
    }
  } else {
    // User is signed out
    window.location.href = "./index.html"; // Redirect to login page
  }
});
