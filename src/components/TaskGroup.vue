<template>
<div class="list-group">
  <h2 v-if="title !== ''" class="subtitle" v-html="title"></h2>

  <slot></slot>

  <div v-for="task in tasks" :key="task['.key']" class="list-group-item" :style="{opacity: task.completed ? 0.5 : 1}">
    <p><strong>{{task.name}}</strong></p>
    
    <div v-if="task.notes" class="line">
      <div class="icon-container">
        <i class="fa fa-book"></i>
      </div>
      <div class="values">
        <p v-for="note in splitNotes(task.notes)" v-bind:key="note">{{note}}</p>
      </div>
    </div>
    
    <div class="line">
      <div class="icon-container">
        <i class="fa fa-clock-o"></i>
      </div>
      <div class="values" :style="{textDecoration: task.completed ? 'line-through' : ''}" v-html="formatDate(task.due)"></div>
    </div>

    <div v-if="task.completed" class="line is-success-color">
      <div class="icon-container">
        <i class="fa fa-check"></i>
      </div>
      <div class="values"  v-html="formatDate(task.completed)"></div>
    </div>

    <div class="line">
      <template v-if="task.subject in subjects">
        <div class="icon-container">
          <div class="colour-ball" v-bind:style="{backgroundColor: subjects[task.subject].colour}"></div>
        </div>
        <div class="values">
          {{task.subject}}
        </div>
      </template>
      <template v-else>
        <div class="icon-container">
          <div class="colour-ball" v-bind:style="{backgroundColor: '#333333'}"></div>
        </div>
        <div class="values">
          Unknown Subject
        </div>
      </template>
    </div>
    <div class="line-button-group">
      <button @click="toggleComplete(task)" class="button is-small is-outlined" :class="{'is-success': !task.completed, 'is-danger': task.completed}">{{!task.completed ? 'Complete' : 'Not Yet Complete'}}</button>
      <button v-if="editable" @click="showEditTask(task)" class="button is-outlined is-small">Edit</button>
    </div>
    <button v-if="editable" @click="showDeleteTask(task)" class="delete" aria-label="close"></button>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import { tasksRef } from "../store/firebase";
import { formatDate, getCurrentDate } from "../utils/dateutils";

export default {
  name: "taskGroup",
  props: {
    tasks: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["subjects", "groupedTasks", "subjectKeys"])
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
    },

    showEditTask(task) {
      this.$emit("showEditTask", task);
    },
    showDeleteTask(task) {
      this.$emit("showDeleteTask", task);
    }
  }
};
</script>

<style lang="scss">
.tasks {
  .list-group {
    margin-top: 1rem;

    &:nth-child(2) {
      margin-top: 0;
    }
  }

  .list-group-item {
    padding: 8px 0 14px 0;

    .line-button-group {
      .button:not(:last-child) {
        margin-right: 5px;
      }
    }
  }
}
</style>
