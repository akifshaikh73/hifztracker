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
        <th v-if="$store.state.login.role == 'teacher'">Action</th>
      </tr>


      <tr v-for="record in records" :key="record.SK">
        <td>
          <router-link :to="{ name: 'record_detail', params: {skey:$store.state.school.key, record_id: record.SK } }">
            {{ record.SK }}
          </router-link>
        </td>
        <td v-if="record.NewLesson.track == 'X'" colspan="2" class="absent">
          Absent
        </td>  
        <td v-if="record.NewLesson.track != 'X'">
          {{ record.NewLesson.juz }}
        </td>
        <td v-if="record.NewLesson.track != 'X'">
          {{ record.NewLesson.lines }}
        </td>
        <td v-if="record.CurrentLesson.track == 'X'" colspan="1" class="absent">
          Absent
        </td>  
        <td v-if="record.CurrentLesson.track != 'X'">
          {{ lists.portions_attached[record.CurrentLesson.portion] }}
        </td>
        <td v-if="record.Revision.track == 'X'" colspan="3" class="absent">
          Absent
        </td>  
          <td v-if="record.Revision.track != 'X'">
            {{ record.Revision.juz }}
          </td>
          <td v-if="record.Revision.track != 'X'">
            {{lists.portions_revision[record.Revision.portion] }}
          </td>
          <td v-if="record.Revision.track != 'X'">
            {{ record.Revision.mistakes }}
          </td>
        <td v-if="$store.state.login.role == 'teacher'">
      <button @click="removeRecord(record.SK)">Delete</button>
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

export default {
  name: "Records",
  data() {
    return {
      records: [],
      lists : {
        portions_attached : common.m_portions_attached,
        portions_revision : common.m_portions_revision,
      },
    };
  },
  created() {
    this.refreshList()
  },
  methods: {
    refreshList() {
      var sid = this.$route.params.student_id;
      var skey = this.$store.state.school.key;

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
    removeRecord(tracker_date) {
      var sid = this.$store.state.student.id;
      var skey = this.$store.state.school.key;
      const api_url = `${common.api_base}record/${skey}/${sid}/${tracker_date}`;
      console.log(api_url);
      axios.delete(api_url, this.record).then((x) => {
        console.log(x);
      });
      this.refreshList();
    },
    newRecordDetail() {
      this.$router.push({ name: "record_detail",params : {record_id:"new"} });
    },
  },
};
</script>
<style scoped>
.absent {
  background-color: rgba(0, 255, 0, 0.336);
}
</style>