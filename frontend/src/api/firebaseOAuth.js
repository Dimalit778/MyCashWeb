import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { app } from "services/firebase/init_firebase";

const auth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider(); // google authentication

export const firebaseOAuth = async () => {
  try {
    const data = await signInWithPopup(auth, GoogleProvider);
    const userData = data._tokenResponse;
    return userData;
  } catch (error) {
    console.log(error);
  }
};
