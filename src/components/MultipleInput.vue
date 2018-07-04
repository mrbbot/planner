<template>
  <div class="multi-input field">
    <label class="label">{{item}}s</label>

    <div v-for="index in indices" :key="index" class="field">
      <div class="control">
        <!--suppress HtmlFormInputWithoutLabel -->
        <input v-model="values[index]" class="input" type="text"/>
        <button @click="deleteItem(index)" class="delete" aria-label="close"></button>
      </div>
    </div>

    <button @click="addItem" class="button">Add {{item}}</button>
  </div>
</template>

<script>
export default {
  model: {
    prop: "values",
    event: "input"
  },
  props: {
    item: {
      type: String,
      required: true
    },
    values: {
      type: Array,
      required: true
    }
  },
  computed: {
    indices() {
      const indices = [];
      for (let i = 0; i < this.values.length; i++) indices.push(i);
      return indices;
    }
  },
  methods: {
    addItem() {
      this.values.push("");
    },
    deleteItem(index) {
      this.values.splice(index, 1);
      this.$emit("input", this.values);
    }
  }
};
</script>

<style lang="scss">
.multi-input .control .delete {
  position: absolute;
  right: 0;
  top: 0;
  margin: 8px;
}
</style>
