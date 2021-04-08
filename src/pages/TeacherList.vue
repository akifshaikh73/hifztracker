<template>
  <table align="center" v-if="$store.state.login.role == 'super_admin' || $store.state.login.role == 'admin'">
    <tr>
      <th>Teacher</th>
    </tr>

    <tr></tr>

    <tr v-for="teacher in teachers" :key="teacher.id">
      <td>
        <router-link :to="{ name: 'students', params: { tid: teacher.id } }">
        <!--router-link :to="{ name: 'students', params: { tid: teacher.id,tname : teacher.name } }"-->
          {{ teacher.name }}
        </router-link>
      </td>
    </tr>
    <tr>
      <td>
        Name:
        <input  type="text"   v-model="newTeacher"/>
        ID:
        <input  type="text"   v-model="teacherID"/>
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
import common from "../tracker_common";

export default {
  name: "Teachers",
  data() {
    return {
      teachers: [],
      newTeacher : "New Teacher",
      teacherID : "id"

    };
  },
  created() {
    if(this.$store.state.login.role == '')
      this.$router.push("/login");
    var schoolkey = this.$route.params.skey;
    this.$store.commit('resetTeacherObject');
    this.$store.commit('resetStudentObject');
    const api_url = common.api_base + "school/" + schoolkey + "/teachers";
    axios.get(api_url).then((x) => {
      console.log(x);
      var schoolName = x.data.filter((student) => student.docType == "school")[0].name;
      console.log(schoolName);
      this.$store.commit('setSchoolObject',{key: schoolkey,name: schoolName});
      this.teachers = x.data.filter((student) => student.docType != "school"); // docType == teacher::usem eg
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
        docType: "teacher::"+schoolkey,
        name: this.newTeacher,
        key: this.teacherID,
        program: "hifz",
        school: this.$store.state.school.name
      };

      const api_url = `${common.api_base}school/${schoolkey}/teacher/`;
      console.log(api_url);
      console.log(this);
      axios.post(api_url, teacherItem).then((x) => {
        console.log(x);
      });
    },
  },

};
</script>