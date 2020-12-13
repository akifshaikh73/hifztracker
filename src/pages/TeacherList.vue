<template>
  <table align="center">
    <tr>
      <th>Teacher</th>
      <th>School</th>
    </tr>

    <tr></tr>

    <tr v-for="teacher in teachers" :key="teacher.id">
      <td>
        <router-link :to="{ name: 'students', params: { tid: teacher.id,tname : teacher.name } }">
          {{ teacher.name }}
        </router-link>
      </td>
      <td>
        {{ $route.params.skey }}
      </td>
    </tr>
  </table>
</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

//import StudentTracker from './components/StudentTracker.vue'
import axios from "axios";
import Route from "vue-router";

export default {
  name: "Teachers",
  data() {
    return {
      teachers: [],
    };
  },
  created() {
    var schoolkey = this.$route.params.skey;
    var schoolName = this.$route.params.sname;
    this.$store.commit('setSchool',schoolName)
    const api_url = "http://localhost:8081/school/" + schoolkey + "/teachers";
    axios.get(api_url).then((x) => {
      console.log(x);
      this.teachers = x.data;
    });
  },
};
</script>