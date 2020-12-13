<template>

  <table align="center">
    <tr>
      <th>Student</th>
      <th>Program</th>
    </tr>
    <tr v-for="s in students" :key="s.id">
      <td>
        <router-link :to="{ name: 'record_list', params: { student_id: s.id , student_name: s.name} }">
          {{ s.name }}
        </router-link>

      </td>
      <td>
        {{ s.program }}
      </td>
    </tr>
  </table>
</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

//import StudentTracker from './components/StudentTracker.vue'
import axios from "axios";
import DefaultNewLesson from "../main";
import DefaultCurrentLesson from "../main";
import DefaultRevision from "../main";

export default {
  name: "App",
  data() {
    return {
      students:[]
    };
  },
  created() {
    var api_url = "";
    var id = this.$route.params.tid;
    var tname = this.$route.params.tname;
    console.log(id);
    console.log(tname);
    if( id.indexOf("teacher") > 0) {
     api_url = "http://localhost:8081/students/teacher/"+id;
     this.$store.commit('setTeacherObject',{id:id,name:tname})
    }
    else
     api_url = "http://localhost:8081/students/school/"+id;


    axios.get(api_url).then((x) => {
      console.log(x);
      this.students = x.data;
    });
  },
};
</script>