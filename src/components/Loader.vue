<template>
<div class="app-loader">Loading...</div>
</template>

<script>
export default {
  name: 'loader',
}
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
  border-top: 1.1em solid rgba(127, 127, 127, 0.1);
  border-right: 1.1em solid rgba(127, 127, 127, 0.1);
  border-bottom: 1.1em solid rgba(127, 127, 127, 0.1);
  border-left: 1.1em solid #03A9F4;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load 1.1s infinite linear;
  animation: load 1.1s infinite linear;
}

@-webkit-keyframes load {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
