import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { getDocument } from "@/services/jbs-firestore";
import type { JbsUser } from "@/domain/jbs-types";

export function subscribeToJbsAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getJbsProfile(firebaseUid: string) {
  return getDocument<JbsUser>("jbs_users", firebaseUid);
}

export async function signOutJbs() {
  await signOut(auth);
}
