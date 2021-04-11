<template>
  <div align="center">
    <table>
      <tr>
        <th></th>
        <th colspan="2">New Lesson</th>
        <th colspan="1">Attached Lesson</th>
        <th colspan="4">General Revision</th>
      </tr>
      <tr>
        <th>Date</th>
        <th>Juz</th>
        <th>Lines</th>
        <th>Portion</th>
        <th>Juz</th>
        <th>Portion</th>
        <th>Mistakes</th>
      </tr>

      <tr>

      </tr>

      <tr v-for="record in records" :key="record.SK">
        <td>
          <router-link :to="{ name: 'record_detail', params: {skey:$store.state.school.key, record_id: record.SK } }">
            {{ record.SK }}
          </router-link>
        </td>
        <td>
          {{ record.NewLesson.juz }}
        </td>
        <td>
          {{ record.NewLesson.lines }}
        </td>
        <td>
          {{ m_portions[record.CurrentLesson.portion] }}
        </td>
        <td>
          {{ record.Revision.juz }}
        </td>
        <td>
          {{ m_portions[record.Revision.portion] }}
        </td>
        <td>
          {{ record.Revision.mistakes }}
        </td>
      </tr>
    </table>
    <div v-if="$store.state.login.role == 'teacher'">
      <button @click="newRecordDetail">Add New</button>
    </div>
  </div>
</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import {
  DefaultCurrentLesson,
  DefaultRevision,
  portions
} from "../main";

import common from "../tracker_common";
import m_mistakes from "../tracker_common";

export default {
  name: "Records",
  data() {
    return {
      records: [],
      m_portions:{
      "h1":"1st Half",
      "h2":"2nd Half",
      "q1":"1st Quarter",
      "q2":"2nd Quarter",
      "q3":"3rd Quarter",
      "q4":"4th Quarter",
      "full" : "Full Juz",
      "current": "Current Juz"
      }
    };
  },
  created() {
    var sid = this.$route.params.student_id;
    var skey = this.$route.params.skey;
    const api_url = `${common.api_base}records/${skey}/${sid}`;
    console.log(api_url);
    console.log(this.m_portions);
    axios.get(api_url).then((x) => {
      console.log(x);
      this.records = x.data.filter(record => record.PK.includes('dtracker::'+skey));
      var students = x.data.filter(record => record.PK == 'student::'+skey);
      var sname = '';
      if(students.length > 0) {
        sname = students[0].name;
        this.$store.commit("setStudentObject", { name: sname, id: sid });
        if(this.$store.state.login.role == '')
          this.$store.state.login.role = 'student';
      }

      this.records.forEach(record => {
        if (record.CurrentLesson == undefined) {
          record.CurrentLesson = DefaultCurrentLesson();
        }
        if (record.Revision == undefined) {
          record.Revision = DefaultRevision();
        }
      });
    });
  },
  methods: {
    newRecordDetail() {
      this.$router.push({ name: "record_detail",params : {record_id:"new"} });
    },
  },
};
</script>