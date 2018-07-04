import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./Home.vue";
import Tasks from "./Tasks.vue";
import Timetable from "./Timetable.vue";
import Subjects from "./Subjects.vue";

// noinspection JSUnresolvedFunction
Vue.use(VueRouter);

const routes = [
  { path: "/", component: Home },
  { path: "/tasks", component: Tasks },
  { path: "/timetable", component: Timetable },
  { path: "/subjects", component: Subjects }
];

export const router = new VueRouter({
  mode: "history",
  routes
});
