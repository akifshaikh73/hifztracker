<template>
  <div>
  <table align="center">
    <tr v-if="error != ''">
      <td colspan = "4" class="error">{{error}}</td>
    </tr>    

    <tr>
      <th>Student</th>
      <th v-if="$store.state.login.role == 'teacher'">
        ID
      </th>
      <th v-if="$store.state.login.role == 'teacher'">
        Password
      </th>
      <th v-if="$store.state.login.role == 'admin'">
        Teacher ID
      </th>
      <th v-if="$store.state.login.role == 'principal'">
        Teacher
      </th>
      <th v-if="$store.state.login.role == 'principal'">
        Program
      </th>

      <th colspan="2" v-if="$store.state.login.role == 'admin' ">Action</th>
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
      <td v-if="$store.state.login.role == 'teacher'">
        <router-link
          :to="{
            name: 'login',
            params: { role:'student', id: s.SK , password: s.password},
          }"
        >
        {{s.SK}}
        </router-link>

      </td>
      <td v-if="$store.state.login.role == 'teacher'">
        {{ s.password}}
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <input type="text" v-model="s.LSK" />
      </td>
      <td v-if="$store.state.login.role == 'principal'">
        {{s.teacher}}
      </td>
      <td v-if="$store.state.login.role == 'principal'">
        {{s.program}}
      </td>
      <td v-if="$store.state.login.role == 'admin'">
        <button @click="assignTeacherToStudent(s.SK, s.LSK)">Assign</button>
      </td>
      <td v-if="$store.state.login.role == 'admin' ">
        <button @click="deleteStudent(s.SK)">Delete</button>
      </td>
    </tr>

  </table>
    <span v-if="$store.state.login.role == 'admin' || $store.state.login.role == 'teacher'">
        Name:<input type="text" v-model="newStudent" />
        <span v-if="$store.state.login.role == 'admin'">
          Teacher ID:<input type="text" v-model="teacherid" />
        </span>
        loginid:<input type="text" v-model="id" />
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
      newStudent: "Name"
    };
  },
  created() {
    if(this.$store.state.login.role == '')
      this.$router.push("/login");
    var tid = this.$route.params.tid;
    console.log("teachers id:" + tid);
    var schoolkey = this.$store.state.school.key;

    
    var api_url = '';
    
    // get students of a school
    if(this.$store.state.login.role == 'principal' || this.$store.state.login.role == 'admin')
      api_url = `${common.getAPIBase()}school/${schoolkey}/students`;
    else  // Get students for a teacher
      api_url = `${common.getAPIBase()}school/${schoolkey}/teacher/${tid}/students`;

    
    this.$store.commit("resetStudentObject");

    axios.get(api_url).then((x) => {
      console.log(x);
      this.students = x.data.filter((student) => student.PK == "student::"+schoolkey);
      var teachers = x.data.filter((student) => student.PK == "teacher::"+schoolkey);
      if (teachers.length > 0)
        this.$store.commit("setTeacherObject", {
          name: teachers[0].name,
          id:teachers[0].SK,
          program: teachers[0].program
      });
      console.log("Sorting")
      this.students = this.students.sort((s1,s2)=> {if (s1.LSK > s2.LSK) return 1; else return -1} );


      this.newStudent = "";
    });
  },
  computed: {
    id() {
      return this.newStudent.replace(/ /g,'.').toLowerCase();
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
        var api_url = '';
        if(this.$store.state.login.role == 'principal' || this.$store.state.login.role == 'admin')
          api_url = `${common.getAPIBase()}school/${schoolkey}/students`;
        else  // Get students for a teacher
          api_url = `${common.getAPIBase()}school/${schoolkey}/teacher/${this.$store.state.teacher.id}/students`;

        axios.get(api_url).then((x) => {
          console.log(x);
          this.students = x.data.filter((student) => student.PK == "student::"+schoolkey);
          this.students = this.students.sort((s1,s2)=> {if (s1.LSK > s2.LSK) return 1; else return -1} );
        });
        this.newStudent = "";
        this.id = "";
    },
    deleteStudent(sid) {
      var schoolkey = this.$store.state.school.key;
      const api_url = `${common.getAPIBase()}school/${schoolkey}/student/${sid}`;
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
      const api_url = `${common.getAPIBase()}school/${schoolkey}/student/`;
      console.log(api_url);
      console.log(this);
      var studentItem = {
        PK: `student::${schoolkey}`,
        name: this.newStudent,
        SK : this.id.trim(),
        program: this.$store.state.teacher.program,
        school: this.$store.state.school.name,
        teacher: this.$store.state.teacher.name,
        password: this.guid(5)
      };
      if(this.$store.state.login.role == 'teacher')
        studentItem.LSK = this.$store.state.teacher.id;
      else   
        studentItem.LSK = this.teacherid;
      axios.post(api_url, studentItem).then((x) => {
        console.log(x);
        this.refreshList(schoolkey);
      });
    },
    assignTeacherToStudent(sid, teacher_id) {
      var schoolkey = this.$store.state.school.key;
      const api_url = `${common.getAPIBase()}school/${schoolkey}/student/`;
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
