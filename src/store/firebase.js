import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { getCurrentDate } from "../utils/dateutils";

// noinspection SpellCheckingInspection
export const app = firebase.initializeApp({
  apiKey: "AIzaSyBO2G2DexU8iYkH76363_5-hOLPh4xtbpQ",
  authDomain: "mrbbot-planner.firebaseapp.com",
  databaseURL: "https://mrbbot-planner.firebaseio.com",
  projectId: "mrbbot-planner",
  storageBucket: "mrbbot-planner.appspot.com",
  messagingSenderId: "315493357478"
});

export const db = app.database();
export const auth = app.auth();

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export let slotsRef;
export let sortedSlotsRef;

export let subjectsRef;

export let tasksRef;
export let sortedFilteredTasksRef;

export let timetableRef;

export function updateRefs(uid) {
  slotsRef = db.ref(uid + "/slots");
  sortedSlotsRef = slotsRef.orderByChild("start");

  subjectsRef = db.ref(uid + "/subjects");

  tasksRef = db.ref(uid + "/tasks");
  sortedFilteredTasksRef = tasksRef
    .orderByChild("due")
    .startAt(getCurrentDate());

  timetableRef = db.ref(uid + "/timetable");

  return {
    slots: sortedSlotsRef,
    subjects: subjectsRef,
    tasks: sortedFilteredTasksRef,
    timetable: timetableRef
  };
}
