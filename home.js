import { getAuth, auth , onAuthStateChanged, sendEmailVerification } from "./firebase.js";


alert()
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      const uid = user.uid;
      console.log(user);
      alert('hi')
  
      // Check if the user's email is verified
      if (!user.emailVerified) {
        Swal.fire({
          title: "Warning",
          text: "Please verify your email.",
          icon: "warning",
          confirmButtonText: "Click here",
        }).then(() => {
          // Send email verification as soon as the user clicks "Click here"
          sendEmailVerification(auth.currentUser)
            .then(() => {
              // Email verification sent successfully
              Swal.fire({
                title: "Verification Sent",
                text: "A verification email has been sent to your inbox. Please check your email.",
                icon: "success",
              });
            })
            .catch((error) => {
              // Error sending verification email
              Swal.fire({
                title: "Error",
                text: `There was an error sending the verification email: ${error.message}`,
                icon: "error",
              });
            });
        });
      }
    } else {
      // User is signed out
      // Handle the sign-out logic or redirect to login page
    }
  });