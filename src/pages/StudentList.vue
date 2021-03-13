<template>
  <table align="center">
    <tr>
      <th>Student</th>
      <th>Teacher</th>
      <th>Action</th>
    </tr>
    <tr v-for="s in students" :key="s.id">
      <td>
        <router-link
          :to="{
            name: 'record_list',
            params: { student_id: s.id, student_name: s.name },
          }"
        >
          {{ s.name }}
        </router-link>
      </td>
      <td>
        <input type="text" v-model="s.teacher" />
      </td>
      <td>
        <button @click="assignTeacherToStudent(s.id,s.teacher)">Assign</button>
      </td>
    </tr>
    <tr>
      <td>
        <input type="text" v-model="newStudent" />
      </td>
      <td>
        <button @click="addNewStudent">Add</button>
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
      students: [],
      newStudent: "Name",
    };
  },
  created() {
    var api_url = "";
    var tid = this.$route.params.tid;
    var tname = this.$route.params.tname;
    console.log("teachers id:" + tid);
    console.log(tname);
    if (tid.indexOf("teacher") == 0) {
      // Get students for a teacher
      api_url = "http://localhost:8081/students/teacher/" + tid;
      this.$store.commit("setTeacherObject", { id: tid, name: tname });
    } else {
      // get students of a school
      api_url = "http://localhost:8081/students/school/" + tid;
    }
    this.$store.commit("resetStudentObject");

    axios.get(api_url).then((x) => {
      console.log(x);
      this.students = x.data;
      this.newStudent = "";
    });
  },
  methods: {
    addNewStudent() {
      var schoolkey = this.$store.state.school.key;
      const api_url = "http://localhost:8081/school/" + schoolkey + "/student/";
      console.log(api_url);
      console.log(this);
      var studentItem = {
        docType: "student",
        name: this.newStudent,
        program: "hifz",
        school: this.$store.state.school.name,
        teacher: this.$store.state.teacher.name,
      };
      axios.post(api_url, studentItem).then((x) => {
        console.log(x);
        this.$router.push({ name: "students" });
      });
    },
    assignTeacherToStudent(sid,teacher_name) {
      var schoolkey = this.$store.state.school.key;
      const api_url = "http://localhost:8081/school/" + schoolkey + "/student/";
      console.log(api_url);
      console.log(sid+":"+teacher_name);
      var selectedStudent = this.students.filter(student => student.id == sid)[0];
      console.log(selectedStudent);
      var studentItem = {
        id: sid,
        docType: selectedStudent.docType,
        name: selectedStudent.name,
        program: selectedStudent.program,
        school: this.$store.state.school.name,
        teacher: teacher_name,
      };
      console.log(studentItem);
      axios.put(api_url, studentItem).then((x) => {
        console.log(x);
        this.$router.push({ name: "students" });
      });
    },
  },
};
</script>