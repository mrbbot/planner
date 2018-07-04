<template>
  <div class="home">
    <div class="box tasks">
      <app-task-group
        title="Priorities"
        :tasks="priorities"
        :editable="false">
        <app-task-progress></app-task-progress>
      </app-task-group>
    </div>
    <div v-show="slots.length > 0" class="box ttable">
      <app-timetable></app-timetable>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { tasksRef } from "../store/firebase";
import { formatDate, getCurrentDate } from "../utils/dateutils";

import TaskGroup from "../components/TaskGroup.vue";
import TaskProgress from "../components/TaskProgress.vue";
import Timetable from "../components/Timetable.vue";

export default {
  name: "home",
  components: {
    "app-task-group": TaskGroup,
    "app-task-progress": TaskProgress,
    "app-timetable": Timetable
  },
  computed: {
    ...mapState(["slots"]),
    ...mapGetters(["priorities", "subjects", "timetableDays"])
  },
  methods: {
    formatDate,
    splitNotes(notes) {
      return notes.split("\n");
    },

    getCompleteValue(currentValue) {
      if (currentValue !== "") return "";

      return getCurrentDate();
    },
    toggleComplete(task) {
      tasksRef.child(task[".key"]).update({
        name: task.name,
        notes: task.notes,
        subject: task.subject,
        due: task.due,
        completed: this.getCompleteValue(task.completed)
      });

      // noinspection JSUnusedGlobalSymbols
      this.modalVisible = false;
    }
  }
};
</script>

<style lang="scss">
.box.tasks .list-group {
  margin-top: 0;

  .list-group-item:last-child {
    padding-bottom: 0;
  }
}

.box.ttable {
  padding-bottom: 4px;
}
</style>
