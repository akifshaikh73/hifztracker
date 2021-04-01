<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/MU.png" />
    <!--HelloWorld msg="Welcome to Your Vue.js App" /-->

    <div class="nav" v-if="$store.state.login.role == 'super_admin'">
      <router-link to="/schools">Schools</router-link>
    </div>
    <div v-if="$store.state.login.role != ''">
      Role:{{$store.getters.Role}}
    </div>

    <div      v-if="$store.state.login.role != '' "    >
      <div v-if="$store.state.login.role == 'admin'">
        School:
        <router-link
          :to="{
            name: 'teachers',
            params: {
              skey: this.$store.state.school.key
            },
          }"
        >
          {{ this.$store.state.school.name }}
        </router-link>
      </div>
      <div v-if="$store.state.login.role == 'admin' || $store.state.login.role == 'teacher'">
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
      </div>
      <div v-if="$store.state.login.role == 'admin' || $store.state.login.role == 'teacher' || $store.state.login.role == 'student'">
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
    </div>
    <div v-if="$store.state.login.role != ''">
      <a href="#" v-on:click="logOut">Logout</a>
    </div>

    <router-view></router-view>
  </div>
</template>



<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
    //var role = this.$router.query.role;
    console.log(this.$route.query.role);
  },
  methods: {
    logOut(event) {
      console.log(this.$store.state.role);
      this.$store.commit("resetLoginContext");
      this.$store.commit("resetStudentObject");
      this.$store.commit("resetTeacherObject");
      this.$router.push("/login");
    },
  },
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

