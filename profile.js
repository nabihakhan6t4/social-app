import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  getFirestore,
  doc,
  updateDoc,
  getDoc,
} from "./firebase.js";

// Cloudinary Configuration
const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dztulz5w5/image/upload";
const cloudinaryPreset = "cxnbrlay"; // Your upload preset

// Profile Edit Form submission
document
  .getElementById("editProfileForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const user = getAuth().currentUser;

    if (user) {
      try {
        const newName = editName.value || user.displayName;
        const newEmail = editEmail.value || user.email;
        const newPhone = editPhone.value || user.phoneNumber;
        const newLocation = editLocation.value || "Not Provided";
        let newProfilePicUrl = user.photoURL;

        if (editProfilePic.files[0]) {
          const formData = new FormData();
          formData.append("file", editProfilePic.files[0]);
          formData.append("upload_preset", cloudinaryPreset); // Your upload preset

          // Upload to Cloudinary
          const res = await fetch(cloudinaryUrl, {
            method: "POST",
            body: formData,
          });
          const cloudinaryData = await res.json();

          // Check if the upload was successful
          if (cloudinaryData.secure_url) {
            newProfilePicUrl = cloudinaryData.secure_url;
          } else {
            throw new Error("Cloudinary upload failed");
          }
        }

        // Update profile in Firebase Authentication
        await updateProfile(user, {
          displayName: newName,
          photoURL: newProfilePicUrl,
        });
        await updateEmail(user, newEmail);

        // Update user information in Firestore
        const userRef = doc(getFirestore(), "users", user.uid);
        await updateDoc(userRef, {
          phoneNumber: newPhone,
          location: newLocation,
        });

        Swal.fire("Success!", "Your profile has been updated.", "success");
      } catch (error) {
        console.error("Error updating profile:", error);
        Swal.fire("Error!", error.message, "error");
      }
    }
  });

// DOM elements
let userEmail = document.getElementById("userEmail");
let userPhone = document.getElementById("userPhone");
let userLocation = document.getElementById("userLocation");
let memberSince = document.getElementById("memberSince");
let profilePic = document.getElementById("profilePic");

let editName = document.getElementById("editName");
let editEmail = document.getElementById("editEmail");
let editPhone = document.getElementById("editPhone");
let editLocation = document.getElementById("editLocation");
let editProfilePic = document.getElementById("editProfilePic");

const auth = getAuth();
const db = getFirestore();

// Firebase authentication state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmail.innerHTML = `${user.email}`;
    userPhone.innerHTML = user.phoneNumber || "Not Provided";
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      userLocation.innerHTML = userData.location || "Location not set";
    } else {
      userLocation.innerHTML = "Location not set";
    }
    memberSince.innerHTML = new Date(
      user.metadata.creationTime
    ).toLocaleDateString();

    if (user.photoURL) {
      profilePic.src = user.photoURL;
    }

    const displayName = user.displayName || "Anonymous User";
    document.getElementById("userName").innerHTML = displayName;
  } else {
    console.log("No user is signed in.");
  }
});
