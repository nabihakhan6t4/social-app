import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "./firebase.js"; // Import only necessary methods

const auth = getAuth();
let signupBtn = document.getElementById("signupBtn");

let signup = () => {
  let email = document.getElementById("signupEmail").value.trim();
  let password = document.getElementById("signupPassword").value.trim();
  let confirmPassword = document
    .getElementById("signupConfirmPassword")
    .value.trim();
  let displayName = document.getElementById("displayName").value.trim();
  let phoneNum = document.getElementById("phoneNumber").value.trim();

  // Validate required fields
  if (!email || !password || !confirmPassword || !displayName || !phoneNum) {
    Swal.fire("Error", "Please fill in all fields.", "error");
    return;
  }

  // Password Match Check
  if (password !== confirmPassword) {
    Swal.fire("Error", "Your passwords do not match.", "error");
    return;
  }

  // Phone Number Regex Validation (11 digits)
  let phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phoneNum)) {
    Swal.fire(
      "Error",
      "Please enter a valid phone number with 11 digits.",
      "error"
    );
    return;
  }

  // Email Regex Validation (simple email check)
  let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    Swal.fire("Error", "Please enter a valid email address.", "error");
    return;
  }

  // Password Strength Check (minimum 6 characters)
  if (password.length < 6) {
    Swal.fire("Error", "Password must be at least 6 characters long.", "error");
    return;
  }

  // Firebase Authentication - Create User with Email and Password
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Success Message
      Swal.fire("Success", "Account created successfully!", "success");

      // Clear form fields
      document.getElementById("signupEmail").value = "";
      document.getElementById("signupPassword").value = "";
      document.getElementById("signupConfirmPassword").value = "";
      document.getElementById("displayName").value = "";
      document.getElementById("phoneNumber").value = "";

      // Redirect to a new page after signup
      setTimeout(() => {
        window.location.href = "home.html"; // Adjust the URL to your desired page
      }, 2000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Handle Firebase errors
      switch (errorCode) {
        case "auth/email-already-in-use":
          Swal.fire(
            "Error",
            "Email is already in use. Please log in or use a different email.",
            "error"
          );
          break;
        case "auth/weak-password":
          Swal.fire(
            "Error",
            "Password is too weak. Please use a stronger password.",
            "error"
          );
          break;
        case "auth/invalid-email":
          Swal.fire(
            "Error",
            "Invalid email format. Please enter a valid email.",
            "error"
          );
          break;
        default:
          Swal.fire("Error", errorMessage, "error");
          break;
      }
    });
};

signupBtn.addEventListener("click", signup);

// // Initialize reCAPTCHA verifier
// window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//   'size': 'normal',
//   'callback': (response) => {
//     // reCAPTCHA solved, allow signInWithPhoneNumber.
//     // ...
//   },
//   'expired-callback': () => {
//     // Response expired. Ask user to solve reCAPTCHA again.
//     // ...
//   }
// });

// // Get the elements
// let sendOtpBtn = document.getElementById("sendOtpBtn");
// let verifyOtpBtn = document.getElementById("verifyOtpBtn");

// // Function to send OTP
// let sendOtp = () => {
//   let phoneNumberOTP = document.getElementById("phoneNumberOTP").value;
//   console.log(`+${phoneNumberOTP}`);

//   // Send OTP via Firebase
//   signInWithPhoneNumber(auth, `+${phoneNumberOTP}`, recaptchaVerifier)
//       .then((confirmationResult) => {
//           // Store the confirmation result for OTP verification
//           window.confirmationResult = confirmationResult;
//           console.log("OTP sent, confirmationResult:", confirmationResult);
//       })
//       .catch((error) => {
//           console.log("Error sending OTP:", error);
//       });
// };

// // Add click event listener to send OTP button
// sendOtpBtn.addEventListener("click", sendOtp);

// // Function to verify OTP
// let verifyOtp = () => {
//   let otp = document.getElementById("otpCode").value;

//   if (window.confirmationResult) {
//       window.confirmationResult.confirm(otp)
//           .then((result) => {
//               // OTP is verified, user signed in successfully
//               console.log("User signed in successfully:", result);
//               alert("OTP verified successfully!");
//           })
//           .catch((error) => {
//               // Handle OTP verification error
//               console.log("Error verifying OTP:", error);
//               alert("Failed to verify OTP.");
//           });
//   } else {
//       console.log("No confirmation result found.");
//       alert("No OTP sent, please try again.");
//   }
// };

// // Add click event listener to verify OTP button
// verifyOtpBtn.addEventListener("click", verifyOtp);



