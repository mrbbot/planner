<template>
  <div id="app">
    <app-header></app-header>
    <section class="container">
      <template v-if="currentUser">
        <app-loader v-if="loaded < 4"></app-loader>
        <router-view v-else></router-view>
      </template>
      <h2 v-else class="subtitle">Please log in...</h2>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Header from './components/Header.vue';
import Loader from './components/Loader.vue';

export default {
  name: 'app',
  components: {
    'app-header': Header,
    'app-loader': Loader
  },
  computed: {
    ...mapState(['loaded', 'currentUser'])
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/initial-variables";

$primary: $grey-darker;

@import "~bulma/bulma";

section.container {
  padding: 1.5rem;
  position: relative;
}

.colour-ball {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-block;
}

.light {
  color: lighten($text-light, 30%);

  strong {
    color: lighten($text-light, 30%);
  }
}

.line {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .icon-container {
    width: 26px;
    height: 26px;
    padding: 0px;
    text-align: left;
    line-height: 26px;

    i {
      width: 16px;
      text-align: center;
    }

    .colour-ball {
      width: 16px;
      height: 16px;
      margin-top: 4px;
    }
  }

  p {
    margin: 0 !important;
  }

  .light {
    color: inherit;
  }
}

.is-success-color {
  color: $success;

  strong {
    color: $success;
  }
}

.is-warning-color {
  color: #FFC107;

  strong {
    color: #FFC107;
  }
}

.is-danger-color {
  color: $danger;

  strong {
    color: $danger;
  }
}

.is-bold {
  font-weight: 600;
}

.list-group {
  padding-bottom: 8px;

  &:last-child {
    padding-bottom: 0;
  }

  .subtitle {
    margin-bottom: 8px;
  }

  .list-group-item {
    position: relative;

    padding: 8px 0;
    border-bottom: 1px solid #BBBBBB;

    &:last-child {
      border-bottom: none;
    }

    .button {
      margin-top: 4px;
    }

    .delete {
      position: absolute;
      top: 10px;
      right: 0;
    }
  }
}

.select, .select select {
  width: 100%;
}
</style>
