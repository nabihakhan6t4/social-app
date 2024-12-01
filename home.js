import {
  getAuth,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  onAuthStateChanged
} from "./firebase.js";

// Initialize Firebase Auth
const auth = getAuth();

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    console.log(user);

    // Check if the user's email is verified
    if (!user.emailVerified) {
      Swal.fire({
        title: "Warning",
        text: "Please verify your email.",
        icon: "warning",
        confirmButtonText: "Click here",
      }).then(() => {
        // Get the user's email
        const email = user.email;

        // Validate email format before checking if it exists
        if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          // Check if email is already in use (email exists)
          fetchSignInMethodsForEmail(auth, email)
            .then((methods) => {
              if (methods.length > 0) {
                // Email exists, proceed with sending verification
                sendEmailVerification(auth.currentUser)
                  .then(() => {
                    Swal.fire({
                      title: "Verification Sent",
                      text: "A verification email has been sent to your inbox. Please check your email.",
                      icon: "success",
                    });
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: "Error",
                      text: `There was an error sending the verification email: ${error.message}`,
                      icon: "error",
                    });
                  });
              } else {
                // Email doesn't exist in the system
                Swal.fire({
                  title: "Email Not Found",
                  text: "This email is not valid. Please use a correct email.",
                  icon: "warning",
                }).then(() => {
                  window.location.href = "./signup.html"; // Redirect to sign-up page
                });
              }
            })
            .catch((error) => {
              // Error while checking email existence
              Swal.fire({
                title: "Error",
                text: `An error occurred while checking the email: ${error.message}`,
                icon: "error",
              });
            });
        } else {
          // If email format is invalid
          Swal.fire({
            title: "Invalid Email",
            text: "Please enter a valid email to receive the verification.",
            icon: "warning",
          });
        }
      });
    }
  } else {
    // User is signed out
    // Handle the sign-out logic or redirect to login page
  }
});
