<template>
  <div align="center">
    <table>
      <tr>
        <th></th>
        <th colspan="3">New Lesson</th>
        <th colspan="1">Attached Lesson</th>
        <th colspan="3">General Revision</th>
      </tr>
      <tr>
        <th>Date</th>
        <th>Juz</th>
        <th>Mistakes</th>
        <th>Page</th>
        <th>Portion</th>
        <th>Juz</th>
        <th>Portion</th>
        <th>Mistakes</th>
      </tr>

      <tr></tr>

      <tr v-for="record in records" :key="record.id">
        <td>
          <router-link
            :to="{ name: 'record_detail', params: { record_id: record.id } }"
          >
            {{ record.date }}
          </router-link>
        </td>
        <td>
          {{ record.NewLesson.juz }}
        </td>
        <td>
          {{ record.NewLesson.mistakes }}
        </td>
        <td>
          {{ record.NewLesson.page }}
        </td>
        <td>
          {{ portions[record.CurrentLesson.portion] }}
        </td>
        <td>
          {{ record.Revision.juz }}
        </td>
        <td>
          {{ portions[record.Revision.portion] }}
        </td>
        <td>
          {{ record.Revision.mistakes }}
        </td>
      </tr>
    </table>
    <div>
      <button @click="newRecordDetail">Add New</button>
    </div>
  </div>
</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import Route from "vue-router";
import {
  DefaultNewLesson,
  DefaultCurrentLesson,
  DefaultRevision,
  portions
} from "../main";

export default {
  name: "Records",
  data() {
    return {
      records: [],
      portions:portions
    };
  },
  created() {
    var sid = this.$route.params.student_id;
    var sname = this.$route.params.student_name;
    this.$store.commit("setStudentObject", { name: sname, id: sid });
    const api_url = "http://localhost:8081/tracker/" + sid;
    console.log(api_url);
    this.portions = portions;
    axios.get(api_url).then((x) => {
      console.log(x);
      this.records = x.data;
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
      this.$router.push({ name: "record_detail" });
    },
  },
};
</script>