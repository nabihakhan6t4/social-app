import { addDoc, collection, db, increment, onSnapshot } from "./firebase.js";

let create = document.getElementById("create");
let list = document.getElementById("list");

// Function to add a todo item to Firestore
let add = async () => {
  let input = document.getElementById("todo");

  // Check if the input is empty before adding
  if (input.value.trim() === "") {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter a valid post!',
    });
    return;
  }

  // Firestore collection reference
  let ref = collection(db, "todos");

  // Add todo to Firestore
  try {
    await addDoc(ref, {
      todo: input.value,
      id: increment(1),
    });

    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Your post has been added!',
    }).then(() => {
      // Close the modal automatically after success
      closeModal();
    });

    console.log("Todo added");

    // Clear the input field after adding the todo
    input.value = "";

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong!',
      text: 'Please try again later.',
    });
    console.error("Error adding todo: ", error);
  }
};

// Function to open the modal
let createPost = () => {
  let modalElement = document.getElementById("modalSheet");

  // If the modal does not exist, create and append it to the DOM
  if (!modalElement) {
    let showModal = document.getElementById("showModal"); // Make sure we are not overwriting the button
    showModal.innerHTML += `
      <div class="modal fade" id="modalSheet" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Create a Post</h1>
              <button type="button" class="btn-close" aria-label="Close" id="closeModalIcon"></button>
            </div>
            <div class="modal-body">
              <input type="text" id="todo" placeholder="Enter your post" class="form-control">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="closeModalBtn">Close</button>
              <button type="button" class="btn btn-primary" id="saveChanges">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners only when modal is added to DOM
    document.getElementById("saveChanges").addEventListener("click", add);
    document.getElementById("closeModalIcon").addEventListener("click", closeModal); // Close when the 'X' icon is clicked
    document.getElementById("closeModalBtn").addEventListener("click", closeModal); // Close when the 'Close' button is clicked
  }

  // Wait for the modal to fully load in the DOM before initializing it
  setTimeout(() => {
    let modalElement = document.getElementById("modalSheet");

    // Now initialize and show the modal using Bootstrap's modal method
    let modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show(); // This will open the modal
  }, 0);
};

// Function to close the modal
let closeModal = () => {
  let modalElement = document.getElementById("modalSheet");
  let modalInstance = new bootstrap.Modal(modalElement); // Initialize modal using bootstrap.Modal
  modalInstance.hide(); // Properly hide the modal
};

// When the "Create Post" button is clicked
create.addEventListener("click", createPost);

// Function to get real-time updates from Firestore and display posts
let getDocs = () => {
  onSnapshot(collection(db, "todos"), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      let { todo } = change.doc.data();
      if (change.type === "added") {
        // Append new posts to the list with a smooth transition
        let newPost = document.createElement("li");
        newPost.textContent = todo;
        newPost.classList.add("fadeInPost");
        list.appendChild(newPost);
      }
      console.log("Change:", change.type);
    });
  });
};

// Call getDocs to listen for real-time updates
getDocs();

// Add smooth fade-in effect for new list items
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .fadeInPost {
      animation: fadeIn 1s ease-in-out;
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
});
