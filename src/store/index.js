import Vue from 'vue';
import Vuex from 'vuex';

import { firebaseMutations, firebaseAction } from 'vuexfire';

import { longDayNames } from '../utils/dateutils';
import { mins, percent } from '../utils/timeutils';

import { auth, updateRefs } from './firebase';

Vue.use(Vuex);

let maxMins = 24 * 60;
let minMins = 0;

export const store = new Vuex.Store({
  strict: true,
  state: {
    slots: [],
    subjects: {},
    tasks: [],
    timetable: {},
    loaded: 0,
    currentUser: null
  },
  getters: {
    subjects(state) {
      if(!state.subjects || '.value' in state.subjects) {
        return {};
      } else {
        return state.subjects;
      }
    },
    subjectKeys(state, getters) {
      if(getters.subjects) {
        return Object.keys(getters.subjects).filter((v) => v !== '.key');
      }
      return [];
    },

    groupedTasks(state) {
      let tasks = state.tasks.slice();

      tasks.sort((a, b) => {
        let aDate = new Date(a.due);
        let bDate = new Date(b.due);

        if(aDate < bDate) {
          return -1;
        } else if(aDate > bDate) {
          return 1;
        }

        if(a.due === b.due) {
          if(a.completed === '') {
            return -1;
          } else if(b.completed === '') {
            return 1;
          }
        }
        return 0;
      });

      let results = [];
      let lastDate = '';
      let currentIndex = -1;
      for(let i = 0; i < tasks.length; i++) {
        if(lastDate !== tasks[i].due) {
          lastDate = tasks[i].due;
          console.log(lastDate);
          results.push({
            title: lastDate,
            arr: []
          });
          currentIndex++;
        }
        results[currentIndex].arr.push(tasks[i]);
      }

      return results;
    },
    priorities(state) {
      let tasks = state.tasks.slice();

      tasks = tasks.filter(a => a.completed === '');

      return tasks;
    },

    detailedSlots(state) {
      if(state.slots.length == 0)
        return [];

      let slots = [];
      for(let i = 0; i < state.slots.length; i++) {
        let slot = {
          name: state.slots[i].name,
          start: state.slots[i].start,
          end: state.slots[i].end
        };

        slot.startMins = mins(slot.start);
        slot.endMins = mins(slot.end);
        slot.mins = slot.endMins - slot.startMins;
        slot.size = slot.mins * (120 / 65); //118

        slots.push(slot);
      }

      return slots;
    },

    timetableDays(state, getters) {
      let slots = getters.detailedSlots;

      if(!state.subjects || slots.length == 0 || !state.timetable)
        return [];

      let now = new Date();
      let thisDay = now.getDay();
      let currentDay = thisDay;

      let testNow = new Date(2017, 10, 2, 9, 37);
      let nowMins = (now.getHours() * 60) + now.getMinutes();

      if(currentDay == 6 || currentDay == 0)
        currentDay = 1;

      let daysAccountedFor = 0;

      let days = [];

      while(daysAccountedFor < 5) {
        let day = {
          name: longDayNames[currentDay],
          lessons: [],
          isToday: thisDay == currentDay
        };

        let firebaseDayObject = state.timetable[day.name] || {};
        for(let i = 0; i < slots.length ; i++) {
          let lessonForSlot = firebaseDayObject[slots[i].name] || { subject: 'Free', subjectColour: '#FFFFFF' };
          lessonForSlot.slot = slots[i];
          lessonForSlot.minsToStart = lessonForSlot.slot.startMins - nowMins;

          if(day.isToday) {
            if(lessonForSlot.minsToStart > 0) {
              if(i == 0) {
                lessonForSlot.isSoon = true;
              } else if(lessonForSlot.minsToStart < slots[i - 1].mins) {
                lessonForSlot.isSoon = true;
              }
            } else if(Math.abs(lessonForSlot.minsToStart) < lessonForSlot.slot.mins) {
              lessonForSlot.isNow = true;
            }
          }

          if(lessonForSlot.subject !== 'Free') {
            if(state.subjects[lessonForSlot.subject]) {
              lessonForSlot.subjectColour = state.subjects[lessonForSlot.subject].colour;
            } else {
              lessonForSlot.subjectColour = '#333333';
              lessonForSlot.subject = 'Unknown Subject';
            }
        }
          
          day.lessons.push(lessonForSlot);
        }
        
        days.push(day);

        currentDay++;
        daysAccountedFor++;

        if(currentDay == 6)
          currentDay = 1;
      }

      return days;
    }
  },
  mutations: {
    ...firebaseMutations,
    firebaseRefLoaded(state) {
      state.loaded++;
    },
    userChanged(state, user) {
      console.log(user);
      state.loaded = 0;
      state.currentUser = user;
    }
  },
  actions: {
    setFirebaseRefs: firebaseAction(({ commit, bindFirebaseRef }, refs) => {
      for(let key in refs) {
        bindFirebaseRef(key, refs[key], {
          readyCallback() {
            console.log("Loaded " + key);
            commit("firebaseRefLoaded");
          }
        });
      }
    }),
    registerFirebaseAuthUpdates({ commit, dispatch }) {
      auth.onAuthStateChanged(user => {
        if(user) {
          let userObj = {
            uid: user.uid,
            name: user.displayName,
            photo: user.photoURL,
            email: user.email
          };

          let refs = updateRefs(userObj.uid);
          
          commit("userChanged", userObj);
          dispatch("setFirebaseRefs", refs);
        } else {
          commit("userChanged", null);
        }
      });
    }
  }
});