<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item" exact-active-class="is-active">Planner</router-link>
      <button @click="menuActive = !menuActive" class="button navbar-burger is-primary">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div :class="{'navbar-menu': true, 'is-active': menuActive}">
      <div v-if="currentUser" class="navbar-start">
        <router-link to="/tasks" @click.native="menuActive = false" class="navbar-item" exact-active-class="is-active">Tasks</router-link>
        <router-link to="/timetable" @click.native="menuActive = false" class="navbar-item" exact-active-class="is-active">Timetable</router-link>
        <router-link to="/subjects" @click.native="menuActive = false" class="navbar-item" exact-active-class="is-active">Subjects</router-link>
      </div>

      <div class="navbar-end">
        <div v-if="currentUser" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            <img :src="currentUser.photo">
          </a>

          <div class="navbar-dropdown is-right">
            <div class="navbar-item">{{currentUser.name}}</div>
            <hr class="navbar-divider">
            <a @click="signOut" class="navbar-item">Logout</a>
          </div>
        </div>
        <a v-else @click="signIn" class="navbar-item">Login</a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import * as firebase from "firebase";
import { auth } from "../store/firebase";

export default {
  data() {
    return {
      menuActive: false
    };
  },
  computed: {
    ...mapState(["currentUser"])
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    },
    signOut() {
      auth.signOut();
    }
  }
};
</script>

<style lang="scss">
.navbar-link img {
  border-radius: 50%;
  background-color: white;
  padding: 1px;
}
</style>
