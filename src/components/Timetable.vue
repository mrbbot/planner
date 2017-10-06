<template>
<div class="timetable">
  <div v-for="day in timetableDays" :key="day.name" class="list-group" :class="day.name.toLowerCase()">
    <h2 class="subtitle" :class="{'is-bold': day.isToday}">{{day.name}}</h2>

    <div v-for="lesson in day.lessons" :key="lesson.slot.name" class="list-group-item" :style="{minHeight: lesson.slot.size + 'px'}">
      <article class="media">
        <div class="media-content" :style="{borderLeftColor: lesson.subjectColour}">
          <div class="content" :class="{'is-warning-color': lesson.isSoon, 'is-danger-color': lesson.isNow, 'light': lesson.subject === 'Free'}">
            <strong v-if="lesson.subject !== 'Free'">{{lesson.subject}}</strong><strong v-else>{{lesson.slot.name}}</strong><br>

            <div class="line">
              <div class="icon-container">
                <i class="fa fa-clock-o"></i>
              </div>
              <div class="values">
                <p>{{lesson.slot.start}} - {{lesson.slot.end}}</p>
              </div>
            </div>

            <div v-if="lesson.teacher" class="line">
              <div class="icon-container">
                <i class="fa fa-user"></i>
              </div>
              <div class="values">
                <p>{{lesson.teacher}}</p>
              </div>
            </div>

            <div v-if="lesson.room" class="line">
              <div class="icon-container">
                <i class="fa fa-map-marker"></i>
              </div>
              <div class="values">
                <p>{{lesson.room}}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
      <div class="buttons" v-show="editing">
        <i @click="showEditLesson(day, lesson)" class="fa fa-pencil"></i>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { timetableRef, slotsRef } from '../store/firebase';
import { shortDayNames } from '../utils/dateutils';

export default {
  name: 'timetableComponent',
  props: {
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['slots']),
    ...mapGetters(['subjects', 'timetableDays', 'subjectKeys'])
  },
  methods: {
    showEditLesson(day, lesson) {
      this.$emit("showEditLesson", day, lesson);
    }
  }
}
</script>

<style lang="scss">
.timetable {
  display: grid;
  grid-template-columns: 1fr;

  .list-group {
    margin-top: 1rem;

    &:first-child {
      margin-top: 0;
    }
  }

  .list-group-item {
    position: relative;

    .media-content {
      padding-left: 10px;
      border-left: 8px solid transparent;
    }

    .buttons {
      position: absolute;
      top: 8px;
      right: 0px;
      padding: 4px;

      background-color: white;

      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      i {
        margin-right: 4px;
        color: #aaaaaa;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        &:hover {
          color: inherit;
        }
      }
    }
  }
}

@media(min-width: 1408px) {
  .timetable {
    grid-template-columns: repeat(5, 1fr);

    .list-group {
      margin-top: 0;
    }

    .list-group-item .buttons {
      right: 15px;
    }

    .monday {
      order: 1;
    }

    .tuesday {
      order: 2;
    }

    .wednesday {
      order: 3;
    }

    .thursday {
      order: 4;
    }

    .friday {
      order: 5;
    }
  }
}
</style>
