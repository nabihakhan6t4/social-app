import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  doc, 
  setDoc 
} from "./firebase.js";

let signupBtn = document.getElementById("signupBtn");

// **Signup Function**
let signup = async () => {
  const name = document.getElementById("displayName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();
  const phoneNum = document.getElementById("phoneNumber").value.trim();

  // Validation
  if (!name || !email || !password || !confirmPassword || !phoneNum) {
    Swal.fire("Error", "Please fill in all fields.", "error");
    return;
  }
  if (password !== confirmPassword) {
    Swal.fire("Error", "Passwords do not match.", "error");
    return;
  }
  if (!/^\d{11}$/.test(phoneNum)) {
    Swal.fire("Error", "Invalid phone number. Enter 11 digits.", "error");
    return;
  }
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    Swal.fire("Error", "Invalid email format.", "error");
    return;
  }
  if (password.length < 6) {
    Swal.fire("Error", "Password must be at least 6 characters.", "error");
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      phone: phoneNum,
    });

    // Check if the verification button exists before disabling it
    let sendVerificationBtn = document.getElementById("sendVerification");
    if (sendVerificationBtn) {
      sendVerificationBtn.disabled = true; 
      sendVerificationBtn.innerText = "Sending...";
    }

    // Send email verification
    await sendEmailVerification(user);
    
    // SweetAlert for successful signup
    Swal.fire({
      title: "Signup Successful!",
      text: "A verification email has been sent. Redirecting to the home page...",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      // Redirect to home page
      window.location.href = "home.html"; // Replace with your home page
    });

  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

// Event Listener
signupBtn.addEventListener("click", signup);
