import { getAuth, sendEmailVerification, onAuthStateChanged } from "./firebase.js";

const auth = getAuth();

// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If email is not verified
    if (!user.emailVerified) {
      handleUnverifiedEmail(user);
    } else {
      console.log("User is signed in and email is verified.");
    }
  } else {
    // If user is not logged in
    window.location.href = "./index.html"; // Redirect to login page
  }
});

/**
 * When the email is not verified, this function will run
 */
async function handleUnverifiedEmail(user) {
  Swal.fire({
    title: "Access Denied",
    html: `
      <p>Your email is not verified. Please verify your email to proceed.</p>
      <button id="sendVerification" style="margin-top: 10px; padding: 8px 16px; background-color: #34c759; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Send Verification Email
      </button>
    `,
    icon: "error",
    showConfirmButton: false,
    didOpen: () => {
      const sendVerificationBtn = document.getElementById("sendVerification");

      sendVerificationBtn.addEventListener("click", async () => {
        try {
          // Disable the button and show loading text
          sendVerificationBtn.disabled = true;
          sendVerificationBtn.innerText = "Sending...";

          // Send verification email
          await sendEmailVerification(user);

          // Show success message
          Swal.fire({
            title: "Verification Sent",
            text: "A verification email has been sent to your inbox. Please verify to continue.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });

          // Redirect after 2 seconds
          setTimeout(() => {
            auth.signOut(); // Sign out the user
            window.location.href = "./index.html"; // Redirect to login page
          }, 2000);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: `Failed to send verification email: ${error.message}`,
            icon: "error",
          });

          // Re-enable the button after an error
          sendVerificationBtn.disabled = false;
          sendVerificationBtn.innerText = "Try Again";
        }
      });
    },
  });
}

// Handle sign out
let signOutBtn = document.getElementById('signOut');
signOutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
    window.location.href = "./index.html"; // Redirect to login page after sign out
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: `Failed to sign out: ${error.message}`,
      icon: "error",
    });
  }
});

// Handle account deletion
let deleteUserBtn = document.getElementById('deletUser');
deleteUserBtn.addEventListener('click', async () => {
  const user = auth.currentUser;

  try {
    // Delete the user account
    await user.delete();
    console.log("User account deleted successfully.");

    // After successful deletion, redirect the user to the sign-in page
    window.location.href = "./signup.html"; // Redirect to login page after deletion
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: `Failed to delete account: ${error.message}`,
      icon: "error",
    });
  }
});
