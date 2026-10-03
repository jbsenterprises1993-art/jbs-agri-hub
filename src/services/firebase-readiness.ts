import { getAuth as getNativeAuth } from "@react-native-firebase/auth";
import { auth as webAuth } from "@/firebaseConfig";

export type FirebaseAuthReadiness = {
  nativeSignedIn: boolean;
  webSignedIn: boolean;
  sameUser: boolean;
  cloudSyncReady: boolean;
  message: string;
};

/**
 * The app currently uses native Firebase Auth for phone OTP while the
 * Firestore client is still wired to the Firebase Web SDK.
 *
 * This helper makes that boundary explicit instead of silently reporting
 * cloud sync as healthy when the two SDK sessions are different.
 */
export function getFirebaseAuthReadiness(): FirebaseAuthReadiness {
  const nativeUser = getNativeAuth().currentUser;
  const webUser = webAuth.currentUser;

  const nativeSignedIn = Boolean(nativeUser);
  const webSignedIn = Boolean(webUser);
  const sameUser =
    nativeSignedIn &&
    webSignedIn &&
    nativeUser?.uid === webUser?.uid;

  if (sameUser) {
    return {
      nativeSignedIn,
      webSignedIn,
      sameUser,
      cloudSyncReady: true,
      message: "Firebase Auth session is available to the Firestore client.",
    };
  }

  if (nativeSignedIn && !webSignedIn) {
    return {
      nativeSignedIn,
      webSignedIn,
      sameUser: false,
      cloudSyncReady: false,
      message:
        "Phone OTP is signed in through native Firebase Auth, but the Web Firebase client has no matching session. Production cloud sync still needs a native Firestore or backend bridge.",
    };
  }

  return {
    nativeSignedIn,
    webSignedIn,
    sameUser,
    cloudSyncReady: false,
    message: "Firebase authentication is not ready for cloud sync.",
  };
}
