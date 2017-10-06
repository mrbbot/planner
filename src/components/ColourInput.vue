<template>
  <div class="colour-input field">
    <label class="label">Colour</label>

    <div class="control">
      <div v-for="colour in colours" :key="colour" @click="selectColour(colour)" class="colour-ball" :class="{active: value === colour}" :style="{backgroundColor: colour}">
        <i class="fa fa-check"></i>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    'value': {
      type: String,
      required: true
    }
  },
  data() {
    return {
      colours: [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFEB3B",
        "#FFC107",
        "#FF9800",
        "#FF5722",
        "#795548",
        "#9E9E9E",
        "#607D8B"
      ]
    }
  },
  methods: {
    selectColour(colour) {
      this.$emit('input', colour)
    }
  }
}
</script>

<style lang="scss">
  .colour-input .control {
    display: grid;
    grid-template-columns: repeat(auto-fill, 32px);
    grid-gap: 10px;

    i {
      display: none;
    }

    .colour-ball {
      border: 5px solid transparent;
      transition: border-color 0.1s ease-in;

      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        border-color: rgba(0, 0, 0, 0.1);
      }

      &.active {
        border-color: rgba(0, 0, 0, 0.2);
        
        i {
          display: block;
          color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
</style>
