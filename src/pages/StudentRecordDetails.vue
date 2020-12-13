<template>
  <div>
    <br />

    <form @submit.prevent="submitRecordDetail">
      <div>
        <span>Date: </span>
        <input type="text" v-model="record.date" required />
      </div>

      <br />
      <h1>New Lesson</h1>

      <div>
        <label>Juz: </label>
        <input type="number" v-model="record.NewLesson.juz" required min=1 max=30/>
      </div>
      <div>
        <span>Mistakes:</span>
        <input type="number" v-model="record.NewLesson.mistakes" />
      </div>
      <div>
        <span>Page:</span>
        <input type="number" v-model="record.NewLesson.page" required />
      </div>

      <div>
        <span>Assigned:</span>
        <input type="checkbox" v-model="record.NewLesson.assigned" />
      </div>
      <div>
        <span>Completed:</span>
        <input type="checkbox" v-model="record.NewLesson.completed" />
      </div>
      <br />
      <h1>Attached Lesson</h1>
      <select v-model="record.CurrentLesson.portion">
        <option value="current">Current</option>
        <option value="h1">1st Half</option>
        <option value="h2">2nd Half</option>
        <option value="q1">1st Quarter</option>
        <option value="q2">2nd Quarter</option>
        <option value="q3">3rd Quarter</option>
        <option value="q4">4th Quarter</option>
      </select>
      <div>
        <span>Assigned:</span>
        <input type="checkbox" v-model="record.CurrentLesson.assigned" />
      </div>
      <div>
        <span>Completed:</span>
        <input type="checkbox" v-model="record.CurrentLesson.completed" />
      </div>
      <br />

      <h1>General Revision</h1>
      <div>
        <label>Juz: </label>
        <input type="number" v-model="record.Revision.juz" required min=1 max=30/>
      </div>
      <div>
        <span>Mistakes:</span>
        <input type="number" v-model="record.Revision.mistakes" />
      </div>

      <br />

      <div>
        <button @click.prevent="submitRecordDetail">Submit</button>
      </div>
    </form>
  </div>
</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import Route from "vue-router";
import { DefaultNewLesson,DefaultCurrentLesson, DefaultRevision } from '../main';

export default {
  name: "RecordDetail",
  data() {
    var d = new Date();
    var datestring =
      d.getMonth() + 1 + "-" + d.getDate() + "-" + d.getFullYear();
    console.log("data():"+datestring)  ;
    console.log("data() record:"+this.record)  ;
    if (this.record == undefined)
      return {
        record: {
          date: datestring,
          program: "hifz",
          NewLesson: DefaultNewLesson(),
          CurrentLesson:  DefaultCurrentLesson(),
          Revision: DefaultRevision(),
        },
      };
    else {
      console.log("else:"+this.record);
      return this.record;
    }  
  },
  created() {
    var rid = this.$route.params.record_id;
    const api_url = "http://localhost:8081/tracker/" + rid;
    axios.get(api_url).then((x) => {
      console.log("created():"+x);
      this.record = x.data;
      if(this.record.CurrentLesson == undefined) {
        this.record.CurrentLesson = DefaultCurrentLesson();
      }
      if(this.record.Revision == undefined) {
        this.record.Revision = DefaultRevision();
      }
    });
  },
  methods: {
    submitRecordDetail() {
      var sid = this.$store.state.student.id;
      var date = this.record.date;
      const api_url = "http://localhost:8081/tracker/" + sid + "::" + date;
      console.log(api_url);
      console.log(this.record);
      axios.post(api_url, this.record).then((x) => {
        console.log(x);
      });
    },
  },
};
</script>

<style>
h1 {
  font-family: arial;
  color: #000;
  font-size: 16px;
  font-size-adjust: none;
  font-stretch: normal;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  line-height: 19px;
  margin-bottom: 7px;
}
</style>