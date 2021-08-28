import Vue from 'vue'
import Vuex from 'vuex'
import {
    DefaultNewLesson,
    DefaultHomework,
    DefaultCurrentLesson,
    DefaultRevision,
  } from './tracker_common';
  
Vue.use(Vuex)



export default new Vuex.Store({
    state: {
        school: {
            key: 'usem',
            name: ''
        },
        teacher: {
            id: '',
            name: '',
            program:''
        },
        student: {
            id: '',
            name: ''
        },
        login: {
            role: '',
            id: '',
            name:'',
            password: ''
        },
        program:'hifz',
        lastRecordDate:'',
        lastRecord:{
            NewLesson: DefaultNewLesson(),
            CurrentLesson: DefaultCurrentLesson(),
            Homework: DefaultHomework(),
            Revision: DefaultRevision()
        }
    },
    getters: {
        // ...
        Role: (state) => {
          return state.login.role.replace(
            /\w\S*/g,
            function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
          );
        }
      },
    mutations: {
        setLogin(state, loginContext) {
            console.log(`role is ${loginContext.role}`);
            console.log("SetLogin:");
            console.log(loginContext);
            state.login.role = loginContext.role;
            state.school.key = loginContext.schoolkey;
            state.school.name = loginContext.schoolname;
            state.login.id = loginContext.id;
            state.login.password = loginContext.password;
            state.login.name = loginContext.name;
            if(loginContext.role == "student")
                state.student.name = loginContext.name;
            if(loginContext.role == "teacher")
                state.teacher.name = loginContext.name;
            /*
            if(loginContext.role == "admin" || loginContext.role == "principal") {
                state.school.name = loginContext.schoolname;
            }*/
        },
        resetLoginContext(state) {
            console.log("ReSet");
            state.login.role = "";
            state.login.name = "";
            state.login.id = "";
            state.login.password = "";
            state.school.name = '';
        },
        setSchoolObject(state, school) {
            console.log("SetSchool");
            console.log(school.name);
            state.school.name = school.name;
            state.school.key = school.key;
        },
        setTeacherObject(state, teacher) {
            console.log("SetTeacherObject");
            console.log(teacher.name);
            state.teacher.name = teacher.name;
            state.teacher.id = teacher.id;
            state.teacher.program = teacher.program;
        },
        setStudentObject(state, student) {
            console.log("SetStudent");
            console.log(student.name);
            state.student.name = student.name;
            state.student.id = student.id;
        },
        resetStudentObject(state) {
            console.log("resetStudent");
            state.student.name = null;  
            state.student.id = null;
        },
        resetTeacherObject(state) {
            console.log("resetTeacher");
            state.teacher.name = null;
            state.teacher.id = null;
        },
        resetlastRecordDate(state) {
            console.log("resetlastRecordDate");
            state.lastRecordDate = "";
        },
        setlastRecordDate(state,recordDate) {
            state.lastRecordDate = recordDate;
            console.log(state.lastRecordDate);
        },
        resetlastRecord(state) {
            console.log("resetlastRecord");
            state.lastRecord = {
                NewLesson: DefaultNewLesson(),
                CurrentLesson: DefaultCurrentLesson(),
                Homework: DefaultHomework(),
                Revision: DefaultRevision()
            };
  
        },
        setlastRecord(state,record) {
            state.lastRecord = record;
            console.log(state.lastRecord);
        },

    }
})