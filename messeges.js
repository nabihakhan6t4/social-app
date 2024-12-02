// Frontend (Client-side) example:
import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  setDoc,
} from "./firebase.js";

// UI Elements
const usersList = document.getElementById("usersList");
const messagesContainer = document.getElementById("messagesContainer");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");

let currentUser = null;
let selectedUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User logged in:", currentUser);
    addUserIfNotExists(user); // Ensure user is added if not present in Firestore
    loadUsers(); // Load the user list after login
    loadMessagesForSelectedUser(); // Load messages only after the user is authenticated
  } else {
    currentUser = null;
    console.log("User not logged in");
  }
});

// Ensure user is added to Firestore if not already present
const addUserIfNotExists = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      if (!user.displayName) {
        const newName = prompt("Please enter your name:");
        try {
          await user.updateProfile({ displayName: newName });
          console.log("Profile updated successfully!");
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
      await setDoc(userRef, {
        name: user.displayName || "Unnamed",
        email: user.email,
      });
    }
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};

// Load users list
async function loadUsers() {
  if (!currentUser) return;

  const usersRef = collection(db, "users");
  const q = query(usersRef);

  onSnapshot(q, (querySnapshot) => {
    usersList.innerHTML = ""; // Clear the list before populating

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const userItem = document.createElement("li");
      userItem.textContent = userData.name;
      userItem.classList.add("user-item");
      userItem.addEventListener("click", () => startChat(doc.id)); // Start chat when clicked
      usersList.appendChild(userItem);
    });
  });
}

// Start chat with selected user
function startChat(userId) {
  selectedUser = userId;
  messagesContainer.innerHTML = ""; // Clear previous messages
  loadMessages(userId); // Load messages for selected user
}

// Load messages between current user and selected user
function loadMessages(userId) {
  if (!currentUser) return;

  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("senderId", "in", [currentUser.uid, userId]),
    where("receiverId", "in", [currentUser.uid, userId]),
    orderBy("timestamp")
  );

  onSnapshot(q, (querySnapshot) => {
    messagesContainer.innerHTML = ""; // Clear previous messages

    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      if (messageData.senderId === currentUser.uid) {
        messageDiv.classList.add("sender");
      } else {
        messageDiv.classList.add("receiver");
      }

      messageDiv.textContent = messageData.message;
      messagesContainer.appendChild(messageDiv);
    });
  });
}

// Send message
sendMessageBtn.addEventListener("click", async () => {
  if (selectedUser === null) {
    alert("Select a user to chat with.");
    return;
  }

  const message = messageInput.value.trim();
  if (message === "") return;

  try {
    await addDoc(collection(db, "messages"), {
      senderId: currentUser.uid,
      receiverId: selectedUser,
      message: message,
      timestamp: new Date().toISOString(),
    });
    messageInput.value = ""; // Clear the input field
  } catch (e) {
    console.error("Error sending message:", e);
  }
});

// Disable the send button if input is empty
messageInput.addEventListener("input", () => {
  sendMessageBtn.disabled = !messageInput.value.trim();
});

// Load messages for the currently selected user
function loadMessagesForSelectedUser() {
  if (!currentUser || !selectedUser) return;

  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("senderId", "in", [currentUser.uid, selectedUser]),
    where("receiverId", "in", [currentUser.uid, selectedUser]),
    orderBy("timestamp")
  );

  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log("Message:", doc.data());
    });
  });
}


// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const sendGrid = require('@sendgrid/mail');

// admin.initializeApp();
// sendGrid.setApiKey('YOUR_SENDGRID_API_KEY');

// exports.sendMessageEmail = functions.firestore
//   .document('messages/{messageId}')
//   .onCreate(async (snapshot, context) => {
//     const message = snapshot.data();
//     const senderId = message.senderId;
//     const receiverId = message.receiverId;

//     try {
//       const senderDoc = await admin.firestore().collection('users').doc(senderId).get();
//       const receiverDoc = await admin.firestore().collection('users').doc(receiverId).get();

//       const senderEmail = senderDoc.data().email;
//       const receiverEmail = receiverDoc.data().email;

//       const msg = {
//         to: receiverEmail,
//         from: senderEmail,
//         subject: `New message from ${senderDoc.data().name}`,
//         text: message.message,
//       };

//       await sendGrid.send(msg);
//       console.log('Email sent to:', receiverEmail);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   });

  
//   admin.initializeApp();
  
//   exports.helloWorld = functions.https.onRequest((req, res) => {
//     res.send("Hello, world!");
//   });
  