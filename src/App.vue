<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/MU.png" />
    <!--HelloWorld msg="Welcome to Your Vue.js App" /-->

    <div class="nav">
      <router-link to="/schools">Schools</router-link>
      -
      <router-link to="/teachers/usem/Uthman Seminary">Teachers</router-link>
      -
      <router-link to="/students/usem">Students</router-link>
    </div>
    <div>
      <!--router-link to="/teachers/{{this.$store.school.key}}/{{this.$store.school.name}}">{{ this.$store.state.school.name}}</router-link-->

      <router-link
        :to="{
          name: 'teachers',
          params: {
            skey: this.$store.state.school.key,
            sname: this.$store.state.school.name,
          },
        }"
      >
        {{ this.$store.state.school.name }}
      </router-link>

      -
      <router-link
        :to="{
          name: 'students',
          params: {
            tid: this.$store.state.teacher.id,
            tname: this.$store.state.teacher.name,
          },
        }"
      >
        {{ this.$store.state.teacher.name }}
      </router-link>

      -
      <router-link
        :to="{
          name: 'record_list',
          params: {
            student_id: this.$store.state.student.id,
            student_name: this.$store.state.student.name,
          },
        }"
      >
        {{ this.$store.state.student.name }}
      </router-link>
    </div>

    <router-view></router-view>
  </div>
</template>



<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */


import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  data() {
    return {
      students: [],
    };
  },
  created() {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style>
table {
  color: #333;
  font-family: Helvetica, Arial, sans-serif;
  width: 640px;
  border-collapse: collapse;
  border-spacing: 0;
}

td,
th {
  border: 1px solid transparent; /* No more visible border */
  height: 30px;
  transition: all 0.3s; /* Simple transition for hover effect */
}

th {
  background: #dfdfdf; /* Darken header a bit */
  font-weight: bold;
}

td {
  background: #fafafa;
  text-align: center;
}


/* Cells in even rows (2,4,6...) are one color */
tr:nth-child(even) td {
  background: #f1f1f1;
}

/* Cells in odd rows (1,3,5...) are another (excludes header cells)  */
tr:nth-child(odd) td {
  background: #fefefe;
}

tr td:hover {
  background: #666;
  color: #fff;
}
/* Hover cell effect! */
</style>

