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
        setSchool(state,name) {
            console.log("SetSchool");
            console.log(name);
            state.school.name = name;
        },
        setTeacher(state,name) {
            console.log("SetTeacher");
            console.log(name);
            state.teacher.name = name;
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
        }
    }
})