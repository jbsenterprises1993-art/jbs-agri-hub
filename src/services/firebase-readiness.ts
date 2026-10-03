import { getAuth } from "@react-native-firebase/auth";

export type FirebaseAuthReadiness = {
  nativeSignedIn: boolean;
  webSignedIn: false;
  sameUser: boolean;
  cloudSyncReady: boolean;
  message: string;
};

/**
 * Day 1 uses the native Firebase Auth session directly for Firestore REST.
 * Firebase documents that REST requests authenticated with a Firebase ID
 * token are evaluated by Firestore Security Rules.
 */
export function getFirebaseAuthReadiness(): FirebaseAuthReadiness {
  const user = getAuth().currentUser;
  const nativeSignedIn = Boolean(user);

  return {
    nativeSignedIn,
    webSignedIn: false,
    sameUser: nativeSignedIn,
    cloudSyncReady: nativeSignedIn,
    message: nativeSignedIn
      ? "Native Firebase Auth session is ready for Firestore REST access."
      : "Firebase phone authentication is not signed in.",
  };
}
