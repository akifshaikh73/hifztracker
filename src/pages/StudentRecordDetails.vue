<template>
  <div>
    <br />
      <p v-if="errors">
          <b v-if="errors.length">Please fix the error(s):</b>
          <ul class="error">
            <li v-for="error in errors" :key="error.id">{{ error }}</li>
          </ul>
      </p>
      <br/>

    <form @submit.prevent="submitRecordDetail">
      <div>
        <span>Date: </span>
        <input type="text" v-model="record.SK" required />
      </div>
      <div>
        <span>Comment: </span>
        <input type="text" v-model="record.comment" required />
      </div>

      <div>
        <span>Absent: </span>
        <input type="checkbox" v-model="record.absent" required  @input="markAbsent()"/>
      </div>

      <h1>New Lesson</h1>
      <br/>

      <div>
        <label>Juz: </label>
        <input  v-model="record.NewLesson.juz" type="number" required :min="1" :max="30"/>
      </div>
      <div>
        <span>Lines:</span>
        <input type="number" v-model="record.NewLesson.lines" :min="1" :max="20"/>
      </div>
      <!--
      <div>
        <span>Page:</span>
        <input type="number" v-model="record.NewLesson.page" required />
      </div>
      -->
      <div>
      <span>Track:</span>
      <select v-model="record.NewLesson.track">
        <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
      </select>
      </div>
      <br />
      <h1>Attached Lesson</h1>
      <br/>
      <div>
      <span>Portion:</span>
      <select v-model="record.CurrentLesson.portion">
          <option v-for="(portion,index) in Object.keys(lists.portions_attached)" :key="index" :value="portion">{{lists.portions_attached[portion]}}</option>
      </select>
      </div>
      <br />
      <span>Track:</span>
      <select v-model="record.CurrentLesson.track">
        <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
      </select>

      <h1>Revision</h1>
      <br/>

      <div>
        <label>Juz: </label>
        <input type="number" v-model="record.Revision.juz" required :min="1" :max="30"/>
      </div>
      <div>
        <span>Portion:</span>
        <select v-model="record.Revision.portion">
          <option v-for="(portion,index) in Object.keys(lists.portions_revision)" :key="index" :value="portion">{{lists.portions_revision[portion]}}</option>
        </select>
      </div>  
      <div>
        <label>Extra Juz: </label>
        <input type="string" v-model="record.Revision.extrajuz" />
      </div>

      <div>
        <span>Mistakes:</span>
      <select v-model="record.Revision.mistakes">
       <option v-for="(mistake,index) in Object.keys(lists.mistakes)" :key="index" :value="mistake">{{lists.mistakes[mistake]}}</option>
      </select>   

      </div>
      <div>
      <span>Track:</span>
      <select v-model="record.Revision.track">
        <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
      </select>
      </div>

      <br />

      <div v-if="$store.state.login.role == 'teacher'">
        <button @click.prevent="submitRecordDetail">Submit</button>
      </div>
    </form>
  </div>
</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import {
  DefaultNewLesson,
  DefaultCurrentLesson,
  DefaultRevision,
} from "../main";

import common from "../tracker_common"


export default {
  name: "RecordDetail",
  data() {
    var d = new Date();
    var datestring = d.toISOString().split("T")[0];
    console.log("data():" + datestring);
    if (this.record == undefined)
      return {
        errors: [],
        lists : {
          mistakes : common.m_mistakes,
          tracks : common.m_tracks,
          portions_attached : common.m_portions_attached,
          portions_revision : common.m_portions_revision,
        },
        record: {
          SK: datestring,
          program: "hifz",
          NewLesson: DefaultNewLesson(),
          CurrentLesson: DefaultCurrentLesson(),
          Revision: DefaultRevision()
        },
      };
    else {
      console.log("else:" + this.record);
      return this.record;
    }
  },
  created() {
    var rid = this.$route.params.record_id;
    var student_id = this.$store.state.student.id;
    var skey = this.$route.params.skey;

    console.log(rid);
    if(rid != 'new') { // New Records will not have a rid
      const api_url = `${common.api_base}record/${skey}/${student_id}/${rid}`;

      axios.get(api_url).then((x) => {
        console.log("created():" + x.data);
        this.record = x.data;
        this.errors = [];

        if (this.record.NewLesson == undefined) {
          this.record.NewLesson = DefaultNewLesson();
        }
        if (this.record.CurrentLesson == undefined) {
          this.record.CurrentLesson = DefaultCurrentLesson();
        }
        if (this.record.Revision == undefined) {
          this.record.Revision = DefaultRevision();
        }
      }).catch((error)=>{
        console.error(error.response);
        this.errors.push(error.response.data);
      });
    } 
  },
  methods: {
    markAbsent() {
      this.record.NewLesson = DefaultNewLesson();
      this.record.CurrentLesson = DefaultCurrentLesson();
      this.record.Revision = DefaultRevision();
      this.record.NewLesson.track = 'X';
      this.record.CurrentLesson.track = 'X';
      this.record.Revision.track = 'X';
    },
    submitRecordDetail() {
      var sid = this.$store.state.student.id;
      var skey = this.$store.state.school.key;
      var date = this.record.SK;
      this.errors = [];
      if (this.record.NewLesson.juz > 30 || this.record.Revision.juz > 30) {
        this.errors.push("1 < Juz < 30");
      } else {
        delete this.errors;
        const api_url = `${common.api_base}record/${skey}/${sid}/${date}`;

        console.log(api_url);
        console.log(this.record);
        axios.post(api_url, this.record).then((x) => {
          console.log(x);
        });
        this.$router.push(`/student/records/${this.$store.state.student.id}`);
      }
    },
  },
};
</script>

<style>
h1 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  color: #000;
  font-size: 25px;
  font-size-adjust: none;
  font-stretch: normal;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  line-height: 19px;
  margin-bottom: 7px;
};
error {
  color : rgb(128, 6, 6)
}
</style>