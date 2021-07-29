<template>
  <div>
  <table align="center">
    <tr v-if="error != ''">
      <td colspan = "4" class="error">{{error}}</td>
    </tr>    

    <tr>
      <th>Student</th>
      <th>ID</th>
      <th>Passkey</th>
      <th v-if="$store.state.login.role == 'admin'">Teacher ID</th>
      <th colspan="2" v-if="$store.state.login.role == 'admin' || $store.state.login.role == 'teacher'">Action</th>
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
      <td>
        {{ s.SK}}
      </td>
      <td>
        {{ s.passkey}}
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <input type="text" v-model="s.LSK" />
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <button @click="assignTeacherToStudent(s.SK, s.LSK)">Assign</button>
      </td>
      <td v-if="$store.state.login.role == 'admin' || $store.state.login.role == 'teacher'">
        <button @click="deleteStudent(s.SK)">Delete</button>
      </td>
    </tr>

  </table>
    <span v-if="$store.state.login.role == 'admin' || $store.state.login.role == 'teacher'">
        Name:<input type="text" v-model="newStudent" />
        loginid:<input type="text" v-model="loginID" />
        <button @click="addNewStudent">Add</button>
      </span>
  </div>
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
      error :'',
      students: [],
      newStudent: "Name",
      //loginid: "LoginId",
    };
  },
  created() {
    if(this.$store.state.login.role == '')
      this.$router.push("/login");
    var tid = this.$route.params.tid;
    console.log("teachers id:" + tid);
    var schoolkey = this.$store.state.school.key;

    // Get students for a teacher
    var api_url = `${common.api_base}school/${schoolkey}/teacher/${tid}/students`;
     /*else { //TODO
      // get students of a school
      api_url = `${common.api_base}/school/${tid}/students`;
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
  computed: {
    loginID() {
      return this.newStudent.replace(' ','.').toLowerCase();
    }
  },
  methods: {
    guid(len) {
        var buf = [],
            chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            charlen = chars.length,
            length = len || 32;
            
        for (var i = 0; i < length; i++) {
            buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
        }
        
        return buf.join('');
    },
    refreshList(schoolkey) {
        this.error = '';
        // refresh the student list
        console.log("refresh the student list");
        var api_url = `${common.api_base}school/${schoolkey}/teacher/${this.$store.state.teacher.loginid}/students`;
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
      }).catch(error=> {
        this.error = error.response.data;
        console.log(error.response.data);
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
        SK : this.loginID,
        program: this.$store.state.teacher.program,
        school: this.$store.state.school.name,
        teacher: this.$store.state.teacher.name,
        LSK: this.$store.state.teacher.loginid,
        passkey: this.guid(5)
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
<style scoped>
.error {
  background-color: rgba(255, 51, 0, 0.336);
}
</style>
