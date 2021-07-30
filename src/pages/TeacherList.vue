<template>
  <table align="center" v-if="$store.state.login.role == 'super_admin' || $store.state.login.role == 'admin'">
    <tr v-if="error != ''">
      <td colspan = "4" class="error">{{error}}</td>
    </tr>    

    <tr>
      <th>Teacher</th>
      <th>Login ID</th>
      <th>Program</th>
      <th>Action</th>
    </tr>

    <tr></tr>

    <tr v-for="teacher in teachers" :key="teacher.id">
      <td>
        <router-link :to="{ name: 'students', params: { tid: teacher.SK } }">
          {{ teacher.name }}
        </router-link>
      </td>
      <td>
        {{teacher.SK}}
      </td>
      <td>
        {{programs[teacher.program]}}
      </td>  
      <td>
        <button class="button-remove" @click="deleteTeacher(teacher.SK)">Delete</button>
      </td>

    </tr>
    <tr>
      <td>
        <input  type="text"   v-model="newTeacher"/>
      </td>  
      <td>
        <input  type="text"   v-model="teacherID"/>
      </td>  
      <td>
        <input  type="text"   v-model="program"/>
      </td>  
      <td>
        <button @click="addNewTeacher">Add</button>
      </td>
    </tr>

  </table>

</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import common from "../tracker_common";

export default {
  name: "Teachers",
  data() {
    return {
      error :'',
      programs : common.m_programs,
      teachers: [],
      newTeacher : "New Teacher",
      teacherID : "loginid",
      program :"hifz"
    };
  },
  created() {
    if(this.$store.state.login.role == '')
      this.$router.push("/login");
    var schoolkey = this.$route.params.skey;
    this.$store.commit('resetTeacherObject');
    this.$store.commit('resetStudentObject');
    const api_url = `${common.getAPIBase()}school/${schoolkey}/teachers`;
    axios.get(api_url).then((x) => {
      console.log(x);
      var schoolName = x.data.filter((student) => student.PK == "school")[0].name;
      console.log(schoolName);
      this.$store.commit('setSchoolObject',{key: schoolkey,name: schoolName});
      this.teachers = x.data.filter((student) => student.PK != "school"); 
      this.newTeacher = "";
      this.teacherID = "";
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
    refreshList(schoolkey) {
        this.error = '';
        const api_url = `${common.getAPIBase()}school/${schoolkey}/teachers`;
        console.log("refreshing teacher list");
        axios.get(api_url).then((x) => {
          console.log(x);
          this.teachers = x.data.filter((teacher) => teacher.PK != "school"); 
          this.newTeacher = "";
          this.teacherID = "";
        });
    },
    deleteTeacher(teacherSK) {
      var schoolkey = this.$route.params.skey;
      const api_url = `${common.getAPIBase()}school/${schoolkey}/teacher/${teacherSK}`;
      console.log(api_url);
      axios.delete(api_url).then((x) => {
        console.log(x);
        this.refreshList(schoolkey);
      }).catch(error=> {
        this.error = error.response.data;
        console.log(error.response.data);
      });
    },
  
    addNewTeacher() {
      var schoolkey = this.$route.params.skey;
      var teacherItem = {
        PK: "teacher::"+schoolkey,
        name: this.newTeacher,
        LSK: this.program,
        SK: this.teacherID,
        program: this.program,
        school: this.$store.state.school.name
      };

      const api_url = `${common.getAPIBase()}school/${schoolkey}/teacher/`;
      console.log(api_url);
      console.log(this);
      axios.post(api_url, teacherItem).then((x) => {
        console.log(x);
        this.refreshList(schoolkey);

      });
    },
  },

};
</script>
<style scoped>
.error {
  background-color: rgba(255, 51, 0, 0.336);
}
</style>
