import { getAuth, auth, onAuthStateChanged, sendEmailVerification } from "./firebase.js";

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
        // Send email verification as soon as the user clicks "Click here"
        sendEmailVerification(auth.currentUser)
          .then(() => {
            // Email verification sent successfully
            Swal.fire({
              title: "Verification Sent",
              text: "A verification email has been sent to your inbox. Please check your email.",
              icon: "success",
            });

            // Show modal (this can be a simple confirmation or OTP modal)
            showModal();
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

// Function to show modal dynamically
function showModal() {
  Swal.fire({
    title: 'Verify your phone number',
    text: 'Enter your phone number to receive OTP',
    input: 'tel',
    inputLabel: 'Phone Number',
    inputPlaceholder: 'Enter your phone number',
    showCancelButton: true,
    confirmButtonText: 'Send OTP',
    preConfirm: (phoneNumber) => {
      if (!phoneNumber) {
        Swal.showValidationMessage('Phone number is required');
        return false;
      }
      // Proceed to OTP sending logic (Firebase phone verification)
      sendPhoneVerification(phoneNumber);
    }
  });
}

// Example function to handle phone verification (using Firebase)
function sendPhoneVerification(phoneNumber) {
  const appVerifier = new firebase.auth.RecaptchaVerifier('signupBtn', {
    size: 'invisible',
  });

  firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      Swal.fire({
        title: 'Enter OTP',
        text: 'We have sent an OTP to your phone.',
        input: 'text',
        inputLabel: 'OTP',
        showCancelButton: true,
        confirmButtonText: 'Verify OTP',
        preConfirm: (otp) => {
          if (!otp) {
            Swal.showValidationMessage('OTP is required');
            return false;
          }

          // Confirm the OTP
          confirmationResult.confirm(otp)
            .then(() => {
              Swal.fire({
                title: 'Phone Verified',
                text: 'Your phone number has been verified successfully!',
                icon: 'success',
              });
            })
            .catch((error) => {
              Swal.fire({
                title: 'Error',
                text: `OTP verification failed: ${error.message}`,
                icon: 'error',
              });
            });
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        title: 'Error',
        text: `Error sending OTP: ${error.message}`,
        icon: 'error',
      });
    });
}
