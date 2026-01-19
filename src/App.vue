<script>
  import Test from './Test.vue';

  export default {
    data() {
      return {
        count: 1
      }
    },
    components: {
      Test
    }
  }
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/about">A propos</RouterLink>
    </nav>
  </header>
  <RouterView/>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <Test/>
  <button @click="count++">Click !</button>
</template>

<style scoped></style>
