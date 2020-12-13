import Vue from 'vue'
import Router from 'vue-router'

import SchoolList from './pages/SchoolList'
import TeacherList from './pages/TeacherList'
import StudentList from './pages/StudentList'
import StudentRecordList from './pages/StudentRecordList'
import StudentRecordDetails from './pages/StudentRecordDetails'

Vue.use(Router);

export default new Router(
  {
    routes: [
      {
        path: '/schools',
        component: SchoolList
      },
      {
        path: '/teachers/:skey/:sname?',
        name: 'teachers',
        component: TeacherList
      },
      {
        path: '/students/:tid/:tname?',
        name: 'students',
        component: StudentList
      },
      {
        path: '/student/records/:student_id/:student_name?',
        name: 'record_list',
        component: StudentRecordList
      },
      {
        path: '/student/detail/:record_id',
        name: 'record_detail',
        component: StudentRecordDetails
      },
      //{ path: '/404', component: NotFound },
      //{ path: '*', redirect: '/404' }
    ]
  }

)