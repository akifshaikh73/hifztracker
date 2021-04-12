<template>
  <table align="center">
    <tr>
      <th>Student</th>
      <th v-if="$store.state.login.role == 'admin'">Teacher ID</th>
      <th colspan="2" v-if="$store.state.login.role == 'admin'">Action</th>
    </tr>
    <tr v-for="s in students" :key="s.SK">
      <td>
        <router-link
          :to="{
            name: 'record_list',
            params: { skey:$store.state.school.key, student_id: s.SK },
          }"
        >
          {{ s.name }}
        </router-link>
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <input type="text" v-model="s.LSK" />
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <button @click="assignTeacherToStudent(s.SK, s.LSK)">Assign</button>
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <button @click="deleteStudent(s.SK)">Delete</button>
      </td>
    </tr>
    <tr v-if="$store.state.login.role == 'admin'">
      <td>
        <input type="text" v-model="newStudent" />
      </td>
      <td>
        <input type="text" v-model="loginid" />
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
      loginid: "LoginId",
    };
  },
  created() {
    if(this.$store.state.login.role == '')
      this.$router.push("/login");
    var tid = this.$route.params.tid;
    console.log("teachers id:" + tid);
    var schoolkey = this.$store.state.school.key;

    // Get students for a teacher
    var api_url = `${common.api_base}students/${schoolkey}/teacher/${tid}`;
    this.$store.commit("setTeacherObject", { id: tid });
     /*else { //TODO
      // get students of a school
      api_url = `${common.api_base}students/school/${tid}`;
    }*/
    this.$store.commit("resetStudentObject");

    axios.get(api_url).then((x) => {
      console.log(x);
      this.students = x.data.filter((student) => student.PK == "student::"+schoolkey);
      var teachers = x.data.filter((student) => student.PK == "teacher::"+schoolkey);
      if (teachers.length > 0)
        this.$store.commit("setTeacherObject", {
          name: teachers[0].name,
          loginid:teachers[0].SK,
          program: teachers[0].program
        });

      this.newStudent = "";
    });
  },
  methods: {
    refreshList(schoolkey) {
        // refresh the student list
        console.log("refresh the student list");
        var api_url = `${common.api_base}students/${schoolkey}/teacher/${this.$store.state.teacher.loginid}`;
        axios.get(api_url).then((x) => {
          console.log(x);
          this.students = x.data.filter((student) => student.PK == "student::"+schoolkey);
        });
        this.newStudent = "";
        this.loginid = "";
    },
    deleteStudent(sid) {
      var schoolkey = this.$store.state.school.key;
      const api_url = `${common.api_base}school/${schoolkey}/student/${sid}`;
      console.log(api_url);
      axios.delete(api_url).then((x) => {
        console.log(x);
        this.refreshList(schoolkey);
      });
    },
    addNewStudent() {
      var schoolkey = this.$store.state.school.key;
      const api_url = `${common.api_base}school/${schoolkey}/student/`;
      console.log(api_url);
      console.log(this);
      var studentItem = {
        PK: `student::${schoolkey}`,
        name: this.newStudent,
        SK : this.loginid,
        program: this.$store.state.teacher.program,
        school: this.$store.state.school.name,
        teacher: this.$store.state.teacher.name,
        LSK: this.$store.state.teacher.loginid,
      };
      axios.post(api_url, studentItem).then((x) => {
        console.log(x);
        this.refreshList(schoolkey);
      });
    },
    assignTeacherToStudent(sid, teacher_id) {
      var schoolkey = this.$store.state.school.key;
      const api_url = `${common.api_base}school/${schoolkey}/student/`;
      console.log(api_url);
      console.log(sid + ":" + teacher_id);
      var selectedStudent = this.students.filter(
        (student) => student.SK == sid
      )[0];
      console.log(selectedStudent);
      var studentItem = {
        SK: sid,
        PK: selectedStudent.PK,
        name: selectedStudent.name,
        program: selectedStudent.program,
        school: this.$store.state.school.name,
        LSK: teacher_id,
      };
      console.log(studentItem);
      axios.put(api_url, studentItem).then((x) => {
        console.log(x);
        this.refreshList(schoolkey);
      });
    },
  },
};
</script>