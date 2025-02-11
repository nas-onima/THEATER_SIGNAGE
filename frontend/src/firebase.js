// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRmygdaxKCl9jKZG7jyYM58BvOcUkfX5I",
  authDomain: "theater-signage-nggc.firebaseapp.com",
  projectId: "theater-signage-nggc",
  storageBucket: "theater-signage-nggc.firebasestorage.app",
  messagingSenderId: "748435080915",
  appId: "1:748435080915:web:46394aa2f4e1d2a982b626",
  measurementId: "G-EP9W9GGJ03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);

const registerUserToMongoDB = async (name, email, uid) => {
  try {
    await fetch(`http://localhost:5000/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
        uid: uid,
      }),
      headers: {
        "Content-type": "application/json",
      },
    }).then(() => {
      console.log("USER REGISTERED TO MONGO DB");
    }).catch((error) => {
      console.log(error.message);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const signUpWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    await registerUserToMongoDB(
      user.displayName,
      user.email,
      user.uid
    )
    // const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);
    // if (docs.docs.length === 0) {
    //   await addDoc({
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
  } catch (error) {
    console.log(error.message);
    console.log(error);
  }
}

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    // const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
    // const docs = await getDocs(q);
    // if (docs.docs.length === 0) {
    //   await addDoc({
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: "google",
    //     email: user.email,
    //   });
    // }
  } catch (error) {
    console.log(error.message);
    console.log(error);
  }
}

const loginWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    console.log(e);
    console.log(e.message);
  }
}

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    console.log("Processing...");
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    console.log("Registered User to Firebase");
    await registerUserToMongoDB(name, email, user.uid);
    console.log("MongoDB にユーザー登録成功");
  } catch (error) {
    console.error("登録エラー", error.message);
  }
};

const sendPwdReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("パスワード再設定用メールを送信しました");
  } catch (error) {
    console.log(error.message);
  }
}

const logout = async () => {
  await signOut(auth);
}

export { auth, firestore, analytics, signUpWithGoogle, signInWithGoogle, loginWithEmailAndPassword, registerWithEmailAndPassword, sendPwdReset, logout };