<template>
<div class="list-group-item">
  <progress class="progress" :class="colourClass" :value="tasks.length - priorities.length" :max="tasks.length"></progress>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'taskProgress',
  computed: {
    ...mapState(['tasks']),
    ...mapGetters(['priorities']),
    colourClass() {
      let percent = (this.tasks.length - this.priorities.length) / this.tasks.length * 100;

      if(percent < 50) {
        return 'is-danger';
      } else if(percent < 100) {
        return 'is-warning';
      } else {
        return 'is-success';
      }
    }
  }
}
</script>

<style lang="scss">

</style>
