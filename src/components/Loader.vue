<template>
<div class="app-loader">Loading...</div>
</template>

<script>
export default {
  name: "loader"
};
</script>

<style lang="scss">
.app-loader,
.app-loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.app-loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border: 1.1em solid rgba(127, 127, 127, 0.1);
  border-left-color: #03a9f4;
  transform: translateZ(0);
  animation: load 1.1s infinite linear;
}

@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
