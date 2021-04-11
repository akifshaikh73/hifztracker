import Vue from 'vue'
import Router from 'vue-router'

import App from './App'
import Login from './pages/Login'
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
        path: '/login/:role?',
        component: Login
      },
      {
        path: '/home',
        query:{role:''},
        component: App
      },
      {
        path: '/schools',
        component: SchoolList
      },
      {
        path: '/teachers/:skey/',
        name: 'teachers',
        component: TeacherList
      },
      {
        path: '/students/:tid/',
        name: 'students',
        component: StudentList
      },
      {
        path: '/student/records/:skey/:student_id/',
        name: 'record_list',
        component: StudentRecordList
      },
      {
        path: '/student/detail/:skey/:record_id',
        name: 'record_detail',
        component: StudentRecordDetails
      },
      //{ path: '/404', component: NotFound },
      //{ path: '*', redirect: '/404' }
    ]
  }

)