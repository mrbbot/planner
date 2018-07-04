<!--suppress HtmlFormInputWithoutLabel -->
<template>
<div class="tasks-wrapper">
  <button @click="showAddTask" class="button is-info">Add Task</button>

  <app-task-progress class="tasks-task-progress"></app-task-progress>

  <div class="tasks">
    <app-task-group v-for="group in groupedTasks" :key="group.title"
      :title="formatDate(group.title, true)"
      :tasks="group.arr"
      @showEditTask="showEditTask"
      @showDeleteTask="showDeleteTask">
    </app-task-group>
  </div>

  <div class="modal" :class="{'is-active': modalVisible}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{modalTask.delete ? "Delete" : (modalTask.new ? "Add" : "Edit")}} Task</p>
        <button @click="modalVisible = false" class="delete" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <template v-if="!modalTask.delete">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input v-model="modalTask.name" class="input" :class="{'is-danger': modalTask.name === ''}" type="text">
            </div>
            <p v-show="modalTask.name === ''" class="help is-danger">
              The task must have a name
            </p>
          </div>

          <div class="field">
            <label class="label">Notes</label>
            <div class="control">
              <textarea v-model="modalTask.notes" class="textarea"></textarea>
            </div>
          </div>

          <div class="field">
            <label class="label">Subject</label>
            <div class="control">
              <div class="select" :class="{'is-danger': modalTask.subject === ''}">
                <select v-model="modalTask.subject">
                  <option></option>
                  <option v-for="subject in subjectKeys" :key="subject" :style="{color: subjects[subject].colour}">
                    <!--suppress HtmlUnknownTag -->
                    <div class="colour-ball" ></div>
                    {{subject}}
                  </option>
                </select>
              </div>
            </div>
            <p v-show="modalTask.subject === ''" class="help is-danger">
              The task must be assigned to a subject
            </p>
          </div>

          <div class="field">
            <label class="label">Due</label>
            <div class="control">
              <input v-model="modalTask.due" class="input" :class="{'is-danger': modalTask.due === ''}" type="date">
            </div>
            <p v-show="modalTask.due === ''" class="help is-danger">
              The task must have a valid due date
            </p>
          </div>
        </template>
        <p v-else>
          Are you sure you want to delete <strong>{{modalTask.name}}</strong>?
        </p>
      </section>
      <footer class="modal-card-foot">
        <template v-if="!modalTask.delete">
          <button v-if="!modalTask.new" @click="updateTask" :disabled="!isValidTask" class="button is-info">Edit Task</button>
          <button v-else @click="addTask" :disabled="!isValidTask" class="button is-info">Add Task</button>
        </template>
        <button v-else @click="deleteTask" class="button is-danger">Delete Task</button>
        <button @click="modalVisible = false" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import { tasksRef } from "../store/firebase";
import { formatDate, getCurrentDate } from "../utils/dateutils";

import TaskGroup from "../components/TaskGroup.vue";
import TaskProgress from "../components/TaskProgress.vue";

export default {
  name: "tasks",
  components: {
    "app-task-group": TaskGroup,
    "app-task-progress": TaskProgress
  },
  data() {
    return {
      modalTask: {
        delete: false,
        new: false,
        ".key": "",
        name: "",
        notes: "",
        subject: "",
        due: "",
        completed: ""
      },
      modalVisible: false
    };
  },
  computed: {
    //...mapState(['tasks']),
    ...mapGetters(["subjects", "groupedTasks", "subjectKeys"]),
    isValidTask() {
      return (
        this.modalTask.name !== "" &&
        this.modalTask.subject !== "" &&
        this.modalTask.due !== ""
      );
    }
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

      this.modalVisible = false;
    },

    showAddTask() {
      this.modalTask = {
        delete: false,
        new: true,
        ".key": "",
        name: "",
        notes: "",
        subject: "",
        due: "",
        completed: ""
      };

      this.modalVisible = true;
    },
    addTask() {
      tasksRef.push({
        name: this.modalTask.name,
        notes: this.modalTask.notes,
        subject: this.modalTask.subject,
        due: this.modalTask.due,
        completed: this.modalTask.completed
      });

      this.modalVisible = false;
    },

    showEditTask(task) {
      this.modalTask = {
        delete: false,
        new: false,
        ".key": task[".key"],
        name: task.name,
        notes: task.notes,
        subject: task.subject,
        due: task.due,
        completed: task.completed
      };

      this.modalVisible = true;
    },
    updateTask() {
      tasksRef.child(this.modalTask[".key"]).update({
        name: this.modalTask.name,
        notes: this.modalTask.notes,
        subject: this.modalTask.subject,
        due: this.modalTask.due,
        completed: this.modalTask.completed
      });

      this.modalVisible = false;
    },

    showDeleteTask(task) {
      this.modalTask.delete = true;
      this.modalTask[".key"] = task[".key"];
      this.modalTask.name = task.name;

      this.modalVisible = true;
    },
    deleteTask() {
      tasksRef.child(this.modalTask[".key"]).remove();

      this.modalVisible = false;
    }
  }
};
</script>

<style lang="scss">
.tasks-task-progress {
  padding-top: 1.4rem;
}

.tasks {
  .list-group {
    margin-top: 1rem;

    &:nth-child(2) {
      margin-top: 0;
    }
  }

  .list-group-item {
    padding: 8px 0 14px 0;
  }
}
</style>
