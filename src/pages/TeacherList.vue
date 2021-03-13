<template>
  <table align="center">
    <tr>
      <th>Teacher</th>
    </tr>

    <tr></tr>

    <tr v-for="teacher in teachers" :key="teacher.id">
      <td>
        <router-link :to="{ name: 'students', params: { tid: teacher.id,tname : teacher.name } }">
          {{ teacher.name }}
        </router-link>
      </td>
    </tr>
    <tr>
      <td>
        <input  type="text"   v-model="newTeacher"/>
      </td>  
    </tr>
    <tr>  
      <td>
        <button @click="addNewTeacher">Add</button>
      </td>
    </tr>

  </table>

</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import Route from "vue-router";

export default {
  name: "Teachers",
  data() {
    return {
      teachers: [],
      newTeacher : "New Teacher"
    };
  },
  created() {
    var schoolkey = this.$route.params.skey;
    var schoolName = this.$route.params.sname;
    this.$store.commit('setSchoolObject',{key: schoolkey,name: schoolName});
    this.$store.commit('resetTeacherObject');
    this.$store.commit('resetStudentObject');
    const api_url = "http://localhost:8081/school/" + schoolkey + "/teachers";
    axios.get(api_url).then((x) => {
      console.log(x);
      this.teachers = x.data;
      this.newTeacher = "";
      console.log("with new Teacher:"+this);
    });
  },
  /*
    {
    "docType": "teacher",
    "id": "teacher::msi::1",
    "name": "Maulana Ahsan Waseem",
    "program": "hifz",
    "school": "Muslim Society Illinois"
  }
  */
  methods: {
    addNewTeacher() {
      var schoolkey = this.$route.params.skey;
      var teacherItem = {
        docType: "teacher",
        name: this.newTeacher,
        program: "hifz",
        school: this.$store.state.school.name
      };

      const api_url = "http://localhost:8081/school/" + schoolkey + "/teacher/";
      console.log(api_url);
      console.log(this);
      axios.post(api_url, teacherItem).then((x) => {
        console.log(x);
      });
    },
  },

};
</script>