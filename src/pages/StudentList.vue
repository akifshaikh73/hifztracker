<template>
  <table align="center">
    <tr>
      <th>Student</th>
      <th v-if="$store.state.login.role == 'admin'">Teacher</th>
      <th v-if="$store.state.login.role == 'admin'">Action</th>
    </tr>
    <tr v-for="s in students" :key="s.id">
      <td>
        <router-link
          :to="{
            name: 'record_list',
            params: { skey:$store.state.school.key, student_id: s.id },
          }"
        >
          {{ s.name }}
        </router-link>
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <input type="text" v-model="s.teacher" />
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <button @click="assignTeacherToStudent(s.id, s.teacher)">Assign</button>
      </td>
    </tr>
    <tr v-if="$store.state.login.role == 'admin'">
      <td>
        Name:
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
import common from "../tracker_common"

export default {
  name: "StudentList",
  data() {
    return {
      students: [],
      newStudent: "Name",
    };
  },
  created() {
    if(this.$store.state.login.role == '')
      this.$router.push("/login");
    var api_url = "";
    var tid = this.$route.params.tid;
    var tname = this.$route.params.tname;
    console.log("teachers id:" + tid);
    console.log(tname);
    var schoolkey = this.$store.state.school.key;

    // Get students for a teacher
    api_url = `${common.api_base}students/${schoolkey}/teacher/${tid}`;
    this.$store.commit("setTeacherObject", { id: tid, name: tname });
     /*else { //TODO
      // get students of a school
      api_url = `${common.api_base}students/school/${tid}`;
    }*/
    this.$store.commit("resetStudentObject");

    axios.get(api_url).then((x) => {
      console.log(x);
      this.students = x.data.filter((student) => student.docType == "student::"+schoolkey);
      var teachers = x.data.filter((student) => student.docType == "teacher::"+schoolkey);
      if (teachers.length > 0)
        this.$store.commit("setTeacherObject", {
          id: tid,
          name: teachers[0].name,
        });

      this.newStudent = "";
    });
  },
  methods: {
    addNewStudent() {
      var schoolkey = this.$store.state.school.key;
      const api_url = `${common.api_base}school/${schoolkey}/student/`;
      console.log(api_url);
      console.log(this);
      var studentItem = {
        docType: `student::${schoolkey}`,
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
    assignTeacherToStudent(sid, teacher_name) {
      var schoolkey = this.$store.state.school.key;
      const api_url = `${common.api_base}school/${schoolkey}/student/`;
      console.log(api_url);
      console.log(sid + ":" + teacher_name);
      var selectedStudent = this.students.filter(
        (student) => student.id == sid
      )[0];
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