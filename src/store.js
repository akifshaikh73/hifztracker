import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        school: {
            key: 'usem',
            name: 'Uthman Seminary'
        },
        teacher: {
            loginid: '',
            name: '',
            program:''
        },
        student: {
            id: '',
            name: ''
        },
        login: {
            role: '',
            school: '',
            id: '',
            password: ''
        },
        program:'hifz'
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
            console.log("SetLogin:"+loginContext);
            state.login.role = loginContext.role;
            state.login.school = loginContext.school;
            state.login.id = loginContext.id;
            state.login.password = loginContext.password;
            state.school.key = loginContext.school;
            state.school.name = loginContext.name;
        },
        resetLoginContext(state) {
            console.log("ReSet");
            state.login.role = "";
            state.login.school = "";
            state.login.id = "";
            state.login.password = "";
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
            state.teacher.loginid = teacher.loginid;
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
        }

    }
})