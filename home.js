import {
  getAuth,
  auth,
  onAuthStateChanged,
  sendEmailVerification,
  deleteUser,
  signOut,
} from "./firebase.js";

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

let createBtn = document.getElementById("create");
let modal = new bootstrap.Modal(document.getElementById("createPostModal"));
let createPostBtn = document.getElementById("createPostBtn");
let postContent = document.getElementById("postContent");
let postCard = document.getElementById("postCard"); // This is the card that will display the user's post content

let create = () => {
  modal.show();
};

let createPost = () => {
  let content = postContent.value.trim();

  if (content === "") {
    Swal.fire({
      title: "No Content",
      text: "Please enter some text to create a post.",
      icon: "warning",
    });
  } else {
    // Get user email (or username if you have it)
    let userName = auth.currentUser ? auth.currentUser.email : "Anonymous";

    // Replace the card content with the user's post
    postCard.innerHTML = `
      <div class="card-header">${userName}'s Post</div>
      <div class="card-body">
        <p>${content}</p>
      </div>
      <div class="card-footer">
        <button class="btn btn-danger" id="deletePostBtn">Delete Post</button>
      </div>
    `;

    // Close the modal
    modal.hide();

    // Clear the input field
    postContent.value = "";

    // Optionally, show a success message or update the UI
    Swal.fire({
      title: "Post Created",
      text: "Your post has been created successfully.",
      icon: "success",
    });

    // Add event listener for deleting the post
    document
      .getElementById("deletePostBtn")
      .addEventListener("click", deletePost);
  }
};

let deletePost = () => {
  // Reset the card content back to the original state
  postCard.innerHTML = `
    <div class="card-header">Create a Post</div>
    <div class="card-body">
      <p>Click the button below to create a new post</p>
    </div>
    <div class="card-footer d-flex justify-content-center">
      <button class="round-btn" id="create">+</button>
    </div>
  `;

  // Reattach event listener for the create button
  document.getElementById("create").addEventListener("click", create);
};

createBtn.addEventListener("click", create);
createPostBtn.addEventListener("click", createPost);




let signOutBtn = document.getElementById("signOut");

let signout = () => {
  // Check if the user is authenticated
  const user = auth.currentUser;

  if (user) {
    // User is signed in, proceed with sign out
    signOut(auth)
      .then(() => {
        // Signed out successfully
        Swal.fire("Success", "Signed out successfully!", "success");

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "./index.html"; // Adjust the URL for the login page if needed
        }, 4000); // Delay for 4 seconds
      })
      .catch((error) => {
        // Handle sign-out error
        Swal.fire(
          "Error",
          "Something went wrong during sign-out. Please try again.",
          "error"
        );
        console.log(error);
      });
  } else {
    // No user is signed in
    Swal.fire("Error", "No user is currently signed in.", "error");
  }
};

signOutBtn.addEventListener("click", signout);
