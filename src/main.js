import Vue from "vue";
import App from "./App.vue";

import { router } from "./routes/";
import { store } from "./store/";

import ColourInput from "./components/ColourInput.vue";
import MultipleInput from "./components/MultipleInput.vue";

Vue.component("colour-input", ColourInput);
Vue.component("multi-input", MultipleInput);

// noinspection JSUnusedGlobalSymbols
String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

import "./registerServiceWorker";

Vue.config.productionTip = false;

// noinspection JSUnusedGlobalSymbols
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  created() {
    // noinspection JSIgnoredPromiseFromCall
    this.$store.dispatch("registerFirebaseAuthUpdates");
  }
});
