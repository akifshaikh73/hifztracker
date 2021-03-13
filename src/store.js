import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state : {
       school:{
           key:'usem',
           name:'Uthman Seminary'
       },
       teacher : {
           id:'',
           name:''
       },
       student :{
           id:'',
           name:''
       } 
    },
    mutations: {
        setSchoolObject(state,school) {
            console.log("SetSchool");
            console.log(school.name);
            state.school.name = school.name;
            state.school.key = school.key;
        },
        setTeacherObject(state,teacher) {
            console.log("SetTeacherObject");
            console.log(teacher.name);
            state.teacher.name = teacher.name;
            state.teacher.id = teacher.id;
        },
        setStudentObject(state,student) {
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