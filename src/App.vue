<template>
  <div id="app" class="container">
    <img alt="Vue logo" src="./assets/MU.png" />
    <!--HelloWorld msg="Welcome to Your Vue.js App" /-->

    <div class="nav" v-if="$store.state.login.role == 'super_admin'">
      <router-link to="/schools">Schools</router-link>
    </div>
    <div v-if="$store.state.login.role != ''">
      Role:{{$store.getters.Role}}
    </div>
    <div v-if="$store.state.login.name != ''">
      Name:{{$store.state.login.name}}
    </div>
    <div v-if="$store.state.school.name != ''">
      School: {{ this.$store.state.school.name }}
    </div>

    <div      v-if="$store.state.login.role != '' "    >
      <div v-if="$store.state.login.role == 'admin'">
        <router-link
          :to="{
            name: 'teachers',
            params: {
              skey: this.$store.state.school.key
            },
          }"
        >
           Teachers
        </router-link>
      </div>
      <div v-if="$store.state.login.role == 'admin' || $store.state.login.role == 'principal'">
        <router-link
          :to="{
            name: 'students',
            params: {
              skey: this.$store.state.school.key
            },
          }"
        >
          Students
        </router-link>
      </div>
      <div v-if="$store.state.login.role == 'teacher'">
        <router-link
          :to="{
            name: 'students',
            params: {
              tid: this.$store.state.teacher.id
            },
          }"
        >
          All Students
        </router-link>
      </div>
      <!--div v-if="$store.state.login.role == 'teacher' || $store.state.login.role == 'student'"-->
      <div v-if="$store.state.student.id != null  ">
          <router-link 
            :to="{
              name: 'record_list',
              params: {
                student_id: this.$store.state.student.id
              },
            }"
          >
          Report - {{ this.$store.state.student.name }}
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
    //console.log(this.$route.query.role);
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

@import url(https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css);

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}




table {
  color: #333;
  font-family: Helvetica, Arial, sans-serif;
  width: 640px;
  border-collapse: collapse;
  border-spacing: 1;
}
/*
td,
th {
  border: 1px solid ; //No more visible border 
  height: 30px;
  transition: all 0.3s; // Simple transition for hover effect 
  text-align: center;
}
*/

th {
  border: black;
  background: #dfdfdf; /* Darken header a bit */
  font-weight: bold;
  text-align: center;
  border:1px solid #050505;
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

.error {
  background-color: rgba(255, 51, 0, 0.336);
}

.button--remove {
  background: none;
  color: red;
  text-transform: uppercase;
  font-size: 11px;
  align-self: flex-end;
}
/* Hover cell effect! */
</style>

