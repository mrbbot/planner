<!--suppress HtmlFormInputWithoutLabel -->
<template>
  <div class="subjects">
    <div v-for="key in subjectKeys" v-bind:key="key" class="box subject">
      <article class="media">
        <figure class="media-left">
          <div class="image colour-ball" v-bind:style="{backgroundColor: subjects[key].colour}"></div>
        </figure>
        <div class="media-content">
          <div class="content">
            <strong>{{key}}</strong><br>

            <div v-if="subjects[key].teachers && subjects[key].teachers.length > 0" class="line">
              <div class="icon-container">
                <i class="fa fa-user"></i>
              </div>
              <div class="values">
                <p v-for="teacher in subjects[key].teachers" v-bind:key="teacher">{{teacher}}</p>
              </div>
            </div>

            <div v-if="subjects[key].rooms && subjects[key].rooms.length > 0" class="line">
              <div class="icon-container">
                <i class="fa fa-map-marker"></i>
              </div>
              <div class="values">
                <p v-for="room in subjects[key].rooms" v-bind:key="room">{{room}}</p>
              </div>
            </div>

            <button @click="showEditSubject(key)" class="button is-outlined">Edit</button>
          </div>
        </div>
        <div class="media-right">
          <button @click="showDeleteSubject(key)" class="delete" aria-label="close"></button>
        </div>
      </article>
    </div>

    <div class="modal" :class="{'is-active': modalVisible}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{modalSubject.delete ? "Delete" : (modalSubject.new ? "Add" : "Edit")}} Subject</p>
          <button @click="modalVisible = false" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <template v-if="!modalSubject.delete">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <input v-model="modalSubject.name" :disabled="!modalSubject.new" class="input" :class="{'is-danger': modalSubject.name === ''}" type="text">
              </div>
              <p v-show="modalSubject.name === ''" class="help is-danger">
                The subject must have a name
              </p>
            </div>

            <!--suppress RequiredAttributes -->
            <colour-input v-model="modalSubject.colour"></colour-input>

            <!--suppress RequiredAttributes -->
            <multi-input item="Teacher" v-model="modalSubject.teachers"></multi-input>
            <!--suppress RequiredAttributes -->
            <multi-input item="Room" v-model="modalSubject.rooms"></multi-input>
          </template>
          <p v-else>
            Are you sure you want to delete <strong>{{modalSubject.name}}</strong>?
          </p>
        </section>
        <footer class="modal-card-foot">
          <button v-if="!modalSubject.delete" @click="updateSubject" :disabled="modalSubject.name === ''" class="button is-info">{{modalSubject.new ? "Add" : "Edit"}} Subject</button>
          <button v-else @click="deleteSubject" class="button is-danger">Delete Subject</button>
          <button @click="modalVisible = false" class="button">Cancel</button>
        </footer>
      </div>
    </div>

    <button @click="showAddSubject" class="button">Add Subject</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { subjectsRef } from "../store/firebase";

export default {
  name: "Subjects",
  data() {
    return {
      modalSubject: {
        delete: false,
        new: false,
        name: "",
        colour: "#9E9E9E",
        teachers: [],
        rooms: []
      },
      modalVisible: false
    };
  },
  computed: {
    ...mapGetters(["subjects", "subjectKeys"])
  },
  methods: {
    showAddSubject() {
      this.modalSubject = {
        delete: false,
        new: true,
        name: "",
        colour: "#9E9E9E",
        teachers: [],
        rooms: []
      };

      this.modalVisible = true;
    },
    showEditSubject(key) {
      const subject = this.subjects[key];

      this.modalSubject = {
        delete: false,
        new: false,
        name: key,
        colour: subject.colour || "#9E9E9E",
        teachers: subject.teachers ? subject.teachers.slice() : [],
        rooms: subject.rooms ? subject.rooms.slice() : []
      };

      this.modalVisible = true;
    },
    updateSubject() {
      const toUpdate = {};
      toUpdate[this.modalSubject.name] = {
        colour: this.modalSubject.colour,
        rooms: this.modalSubject.rooms,
        teachers: this.modalSubject.teachers
      };

      subjectsRef.update(toUpdate);

      this.modalVisible = false;
    },

    showDeleteSubject(key) {
      this.modalSubject.delete = true;
      this.modalSubject.name = key;

      this.modalVisible = true;
    },
    deleteSubject() {
      subjectsRef.child(this.modalSubject.name).remove();

      this.modalVisible = false;
    }
  }
};
</script>

<style lang="scss">
.subject {
  &:last-child {
    margin-bottom: 0;
  }

  .button {
    margin-top: 15px;
  }
}
</style>
