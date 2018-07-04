<!--suppress HtmlFormInputWithoutLabel -->
<template>
<div class="timetable-wrapper">
  <app-timetable :editing="editing" @showEditLesson="showEditLesson"></app-timetable>

  <div>
    <button @click="editing = !editing" class="button" :class="{'is-success': editing}">{{editing ? "Done" : "Edit"}}</button>
    <button @click="showAddSlot" v-show="editing" class="button">Add Slot</button>
    <button @click="showDeleteSlot" v-show="editing" class="button">Delete Slot</button>
  </div>

  <div class="modal" :class="{'is-active': lessonModalVisible}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Lesson</p>
        <button @click="lessonModalVisible = false" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Day</label>
          <div class="control">
            <input v-model="lessonModal.day" class="input" type="text" disabled>
          </div>
        </div>
        
        <div class="field">
          <label class="label">Slot</label>
          <div class="control">
            <input v-model="lessonModal.slot" class="input" type="text" disabled>
          </div>
        </div>

        <div class="field">
          <label class="label">Subject</label>
          <div class="control">
            <div class="select">
              <select v-model="lessonModal.subject" @change="subjectChanged">
                <option>Free</option>
                <option v-for="subject in subjectKeys" :key="subject" :style="{color: subjects[subject].colour}">{{subject}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Teacher</label>
          <div class="control">
            <div class="select" :class="{'is-danger': !isValidTeacher}">
              <select v-model="lessonModal.teacher" :disabled="availableTeachers.length === 0">
                <option></option>
                <option v-for="teacher in availableTeachers" :key="teacher">{{teacher}}</option>
              </select>
            </div>
          </div>
          <p v-show="!isValidTeacher" class="help is-danger">
            A teacher must be assigned to the lesson
          </p>
        </div>

        <div class="field">
          <label class="label">Room</label>
          <div class="control">
            <div class="select" :class="{'is-danger': !isValidRoom}">
              <select v-model="lessonModal.room" :disabled="availableRooms.length === 0">
                <option></option>
                <option v-for="room in availableRooms" :key="room">{{room}}</option>
              </select>
            </div>
          </div>
          <p v-show="!isValidRoom" class="help is-danger">
            A room must be assigned to the lesson
          </p>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button @click="editLesson" class="button is-info" :disabled="!isValidLesson">Edit Lesson</button>
        <button @click="lessonModalVisible = false" class="button">Cancel</button>
      </footer>
    </div>
  </div>



  <div class="modal" :class="{'is-active': slotModalVisible}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{slotModal.delete ? "Delete" : "Add"}} Slot</p>
        <button @click="slotModalVisible = false" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!slotModal.delete" class="field">
          <label class="label">Slot</label>
          <div class="control">
            <input v-model="slotModal.slot" class="input" :class="{'is-danger': (slotModal.slot === '') || slotExists}" type="text">
          </div>
          <p v-show="slotModal.slot === ''" class="help is-danger">
            The slot must have a name
          </p>
          <p v-show="slotExists" class="help is-danger">
            This slot already exists
          </p>
        </div>
        <div v-else class="field">
          <label class="label">Slot</label>
          <div class="control">
            <div class="select" :class="{'is-danger': slotModal.slot === ''}">
              <select v-model="slotModal.slot">
                <option></option>
                <option v-for="slot in slots" :key="slot['.key']" :value="slot['.key']">{{slot.name}}</option>
              </select>
            </div>
          </div>
          <p v-show="slotModal.slot === ''" class="help is-danger">
            You must select a slot
          </p>
        </div>
        
        <div v-if="!slotModal.delete" class="field">
          <label class="label">Start</label>
          <div class="control">
            <input v-model="slotModal.start" class="input" :class="{'is-danger': slotModal.start === ''}" type="time">
          </div>
          <p v-show="slotModal.start === ''" class="help is-danger">
            The slot must have a start time
          </p>
        </div>

        <div v-if="!slotModal.delete" class="field">
          <label class="label">End</label>
          <div class="control">
            <input v-model="slotModal.end" class="input" :class="{'is-danger': slotModal.end === ''}" type="time">
          </div>
          <p v-show="slotModal.end === ''" class="help is-danger">
            The slot must have a end time
          </p>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button v-if="!slotModal.delete" @click="addSlot" :disabled="!isValidSlot" class="button is-info">Add Slot</button>
        <button v-else @click="deleteSlot" :disabled="slotModal.slot === ''" class="button is-danger">Delete Slot</button>
        <button @click="slotModalVisible = false" class="button">Cancel</button>
      </footer>
    </div>
  </div>

</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { timetableRef, slotsRef } from "../store/firebase";

import Timetable from "../components/Timetable.vue";

export default {
  name: "timetable",
  components: {
    "app-timetable": Timetable
  },
  data() {
    return {
      editing: false,

      lessonModal: {
        day: "Day",
        slot: "Slot",
        subject: "Free",
        teacher: "",
        room: ""
      },
      lessonModalVisible: false,

      slotModal: {
        delete: false,
        slot: "",
        start: "",
        end: ""
      },
      slotModalVisible: false
    };
  },
  computed: {
    ...mapState(["slots"]),
    ...mapGetters(["subjects", "timetableDays", "subjectKeys"]),

    availableTeachers() {
      if (this.lessonModal.subject === "Free") return [];
      else return this.subjects[this.lessonModal.subject].teachers.slice();
    },
    availableRooms() {
      if (this.lessonModal.subject === "Free") return [];
      else return this.subjects[this.lessonModal.subject].rooms.slice();
    },

    isValidTeacher() {
      if (this.lessonModal.subject === "Free") return true;
      else return this.lessonModal.teacher !== "";
    },
    isValidRoom() {
      if (this.lessonModal.subject === "Free") return true;
      else return this.lessonModal.room !== "";
    },
    isValidLesson() {
      return this.isValidTeacher && this.isValidRoom;
    },

    slotExists() {
      for (let i = 0; i < this.slots.length; i++) {
        if (this.slots[i].name === this.slotModal.slot) {
          return true;
        }
      }
      return false;
    },
    isValidSlot() {
      return (
        this.slotModal.name !== "" &&
        this.slotModal.start !== "" &&
        this.slotModal.end !== "" &&
        !this.slotExists
      );
    }
  },
  methods: {
    subjectChanged() {
      this.lessonModal.teacher = "";
      this.lessonModal.room = "";
    },
    showEditLesson(day, lesson) {
      this.lessonModal = {
        day: day.name,
        slot: lesson.slot.name,
        subject: lesson.subject,
        teacher: lesson.teacher || "",
        room: lesson.room || ""
      };

      this.lessonModalVisible = true;
    },
    editLesson() {
      const ref = timetableRef
        .child(this.lessonModal.day)
        .child(this.lessonModal.slot);
      if (this.lessonModal.subject === "Free") {
        ref.remove();
      } else {
        ref.update({
          subject: this.lessonModal.subject,
          teacher: this.lessonModal.teacher,
          room: this.lessonModal.room
        });
      }

      this.lessonModalVisible = false;
    },

    showAddSlot() {
      this.slotModal = {
        delete: false,
        slot: "",
        start: "",
        end: ""
      };

      this.slotModalVisible = true;
    },
    addSlot() {
      slotsRef.push({
        name: this.slotModal.slot,
        start: this.slotModal.start,
        end: this.slotModal.end
      });

      this.slotModalVisible = false;
    },
    showDeleteSlot() {
      this.slotModal.delete = true;
      this.slotModal.slot = "";

      this.slotModalVisible = true;
    },
    deleteSlot() {
      slotsRef.child(this.slotModal.slot).remove();

      this.slotModalVisible = false;
    }
  }
};
</script>

<style lang="scss">
</style>
