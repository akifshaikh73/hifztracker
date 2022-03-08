<template>
  <div class="container">
    <br />
      <p v-if="m_errors">
          <b v-if="m_errors.length">Please fix the error(s):</b>
          <ul class="error">
            <li v-for="error in m_errors" :key="error.id">{{ error }}</li>
          </ul>
      </p>
      <br/>

    <form @submit.prevent="submitRecordDetail">
      <div>
        <label>Date: </label>
        <input  type="text" placeholder="YYYY-MM-DD" v-model="record.SK" required v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <div>
        <label>Comment: </label>
        <textarea style="width:300px" maxlength="500" placeholder="Comment" v-model="record.comment" required v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>

      <div v-if="$store.state.login.role == 'teacher'">
      <label>Absent All Day: </label>
        <input type="checkbox" v-model="record.absent" required  @input="markAbsent()"/>
      </div>

      <!--------New Lesson ------------------------------->

      <hr/>
      <h4 class="mb-3">New Lesson</h4>
      <div>
        <label>Juz #: </label>
        <input  v-model="record.NewLesson.juz" type="number" required :min="1" :max="30" placeholder="3" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <div>
        <label># of Lines :</label>
        <input type="number" v-model="record.NewLesson.lines" :min="1" :max="20" placeholder="10" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <div>
        <label>Page #(optional):</label>
        <input type="number" v-model="record.NewLesson.page" required  placeholder="3" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <div>
        <label>Surah (optional):</label>
        <input type="string" v-model="record.NewLesson.surah" placeholder="Ale-Imran" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <div>
      <label>{{tracklabel}}:</label>
      <select v-model="record.NewLesson.track" v-bind:disabled="$store.state.login.role == 'student'" ref="newLessonTrack" @input="handleNewLessonTrack()">
        <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
      </select>
      </div>

      <!--------Attached Lesson ------------------------------->
      <hr/>
      <h4 class="mb-3">Attached Lesson</h4>
      <div>
      <label>Portion:</label>
      <select v-model="record.CurrentLesson.portion" v-bind:disabled="$store.state.login.role == 'student'">
          <option v-for="(portion,index) in Object.keys(lists.portions_attached)" :key="index" :value="portion">{{lists.portions_attached[portion]}}</option>
      </select>
      </div>

      <div v-if="record.CurrentLesson.portion == 'other'">
        <label>Other:</label>
        <input type="string" v-model="record.CurrentLesson.other"  placeholder="Lines , Page # etc" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>

      <label>{{tracklabel}}:</label>
      <select v-model="record.CurrentLesson.track" v-bind:disabled="$store.state.login.role == 'student'" ref="attachedLessonTrack" @input="handleAttachedLessonTrack()"> 
        <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
      </select>
      <hr/>

      <!--------Revision ------------------------------->
      <h4 class="mb-3">Revision</h4>

      <div>
        <label>Juz: </label>
        <input type="number" v-model="record.Revision.ajza[0].juz" required :min="1" :max="30" placeholder="5" class="textbox" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <div>
        <label>Portion:</label>
        <select v-model="record.Revision.ajza[0].portion" v-bind:disabled="$store.state.login.role == 'student'">
          <option v-for="(portion,index) in Object.keys(lists.portions_revision)" :key="index" :value="portion">{{lists.portions_revision[portion]}}</option>
        </select>
      </div>  
      <div>
        <label>Mistakes:</label>
        <select v-model="record.Revision.ajza[0].mistakes" v-bind:disabled="$store.state.login.role == 'student'" >
        <option v-for="(mistake,index) in Object.keys(lists.mistakes)" :key="index" :value="mistake">{{lists.mistakes[mistake]}}</option>
        </select>   
      </div>
      <div>
        <label>{{tracklabel}}:</label>
        <select v-model="record.Revision.ajza[0].track" v-bind:disabled="$store.state.login.role == 'student'" ref="revisionTrack" @input="handleRevisionTrack('ej')">
          <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
        </select>
      </div>
      
      <div>
        <label>Extra Juz: </label>
        <input type="checkbox" v-model="record.Revision.extraJuz" required  @input="setExtraJuz()"    v-bind:disabled="$store.state.login.role == 'student'"/>
      </div>

      <div v-if="record.Revision.extraJuz">
        <div>
          <label>Extra Juz: </label>
          <input type="number" v-model="record.Revision.ajza[1].juz" required :min="1" :max="30" class="textbox" placeholder="2" v-bind:readonly="$store.state.login.role == 'student'"/>
        </div>
        
        <div>
          <label>Mistakes:</label>
          <select v-model="record.Revision.ajza[1].mistakes" v-bind:disabled="$store.state.login.role == 'student'">
          <option v-for="(mistake,index) in Object.keys(lists.mistakes)" :key="index" :value="mistake">{{lists.mistakes[mistake]}}</option>
          </select>   
        </div>

        <div>
          <label>{{tracklabel}}:</label>
          <select v-model="record.Revision.ajza[1].track" v-bind:disabled="$store.state.login.role == 'student'"  ref="revisionTrack1" @input="handleRevisionTrack('ej1')">
            <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
          </select>
        </div>

        <div>
          <label>Extra Ajza : </label>
          <input type="text" v-model="record.Revision.ajza[2].juz" required  class="textbox" placeholder="2,3-5" v-bind:readonly="$store.state.login.role == 'student'"/>
        </div>
        
        <div>
          <label>Mistakes:</label>
          <select v-model="record.Revision.ajza[2].mistakes" v-bind:disabled="$store.state.login.role == 'student'">
          <option v-for="(mistake,index) in Object.keys(lists.mistakes)" :key="index" :value="mistake">{{lists.mistakes[mistake]}}</option>
          </select>   
        </div>

        <div>
          <label>{{tracklabel}}:</label>
          <select v-model="record.Revision.ajza[2].track" v-bind:disabled="$store.state.login.role == 'student'" ref="revisionTrack2" @input="handleRevisionTrack('ej2')">
            <option v-for="(track,index) in Object.keys(lists.tracks)" :key="index" :value="track">{{lists.tracks[track]}}</option>
          </select>
        </div>
      </div>


      <hr/>
      <!--------Homework ------------------------------->
      <h4 class="mb-3">Homework</h4>
      <div>
        <label>New Lesson: </label>
        <input type="string" v-model="record.Homework.newLesson" placeholder="# of Lines , Surah or Ayahs" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <label>Attached Lesson:</label>
      <select v-model="record.Homework.attachedLesson" v-bind:disabled="$store.state.login.role == 'student'">
          <option v-for="(portion,index) in Object.keys(lists.portions_attached)" :key="index" :value="portion">{{lists.portions_attached[portion]}}</option>
      </select>

      <div v-if="record.Homework.attachedLesson == 'other'">
        <label>Other:</label>
        <input type="string" v-model="record.Homework.other" placeholder="Lines , Page # etc" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>

      <div>
        <label>Revision:</label>
        <input type="string" v-model="record.Homework.revision"  placeholder="Juz #, Extra Juz" v-bind:readonly="$store.state.login.role == 'student'"/>
      </div>
      <div>
      </div>

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
  DefaultHomework,
  DefaultCurrentLesson,
  DefaultRevision,
} from "../tracker_common";

import common from "../tracker_common"


export default {
  name: "RecordDetail",
  data() {
    var d = new Date();
    var datestring = d.toISOString().split("T")[0];
    console.log("data():" + datestring);
    if (this.record == undefined)
      return {
        tracklabel :"Performance",
        m_errors: [],
        lists : {
          mistakes : common.m_mistakes,
          ntxTracks : ['N','T','X'],
          tracks : common.m_tracks,
          portions_attached : common.m_portions_attached,
          portions_revision : common.m_portions_revision,
        },
        record: {
          SK: datestring,
          program: "hifz",
          // Default the data from the stored state
          NewLesson: this.$store.state.lastRecord.NewLesson,
          CurrentLesson: this.$store.state.lastRecord.CurrentLesson,
          Homework: this.$store.state.lastRecord.Homework,
          Revision: this.$store.state.lastRecord.Revision
        },
      };
    else {
      console.log("else:" + this.record);
      return this.record;
    }
  },
  created() {
    common.initAPIURL();
    var rid = this.$route.params.record_id;
    var student_id = this.$route.params.student_id;
    console.log(`Store state ${this.$store.state}`);
    var skey = this.$route.params.skey;
    console.log(`${skey}/${student_id}/${rid}`);
    if(rid != 'new') { // New Records will not have a rid
      const api_url = `${common.getAPIBase()}record/${skey}/${student_id}/${rid}`;
      console.log(`API URL ${common.getAPIBase()} ${api_url}`);
      axios.get(api_url).then((x) => {
        console.log(x.data);
        if(this.$store.state.student.name == "" || this.$store.state.student.name == undefined) {
          var student = x.data[0];
          this.$store.commit("setStudentObject", { name: student.name, id: student.SK });
          if (this.$store.state.login.role == "") {
                this.$router.push("/login");
          }
        }

        this.record = x.data[1]; // 1st element is student item , second is tracking record
        this.m_errors = [];

        if (this.record.NewLesson == undefined) {
          this.record.NewLesson = DefaultNewLesson();
        }
        if (this.record.CurrentLesson == undefined) {
          this.record.CurrentLesson = DefaultCurrentLesson();
        }
        if (this.record.Homework == undefined) {
          this.record.Homework = DefaultHomework();
        }
        if (this.record.Revision == undefined) {
          this.record.Revision = DefaultRevision();
        }
      }).catch((error)=>{
        console.error(error.response);
        this.m_errors.push(error.response.data);
      });
    } else {
      // New Record
      console.log(this.$store.state.lastRecordDate);
      if(this.$store.state.lastRecordDate != '') {
        var lastRecordDate = new Date(this.$store.state.lastRecordDate);
        lastRecordDate.setDate(lastRecordDate.getDate()+1);
        var strLastDate = (new Date(lastRecordDate)).toISOString().split('T')[0];
        console.log(strLastDate);
        console.log(this.record);
        this.record.SK = strLastDate;
      }

    }
  },
  methods: {
    setExtraJuz() {
      console.log(`Extra Juz ${this.record.Revision.extraJuz}`);

    },

    handleNewLessonTrack() {
      var trackID  = this.$refs.newLessonTrack.options[this.$refs.newLessonTrack.selectedIndex].value ;
      console.log(trackID);
      if(this.lists.ntxTracks.indexOf(trackID) != -1) {
        console.log(`Resetting`);
        this.record.NewLesson.juz = null;
        this.record.NewLesson.lines = null;
        this.record.NewLesson.page = null;
        this.record.NewLesson.surah = null;

      }
    },
    handleAttachedLessonTrack() {
      var trackID  = this.$refs.attachedLessonTrack.options[this.$refs.attachedLessonTrack.selectedIndex].value ;
      console.log(trackID);
      if(this.lists.ntxTracks.indexOf(trackID) != -1) {
        console.log(`Resetting Attached`);
        this.record.CurrentLesson.portion = null;
      }
    },

    handleRevisionTrack(ej) {
      var trackID  = null;
      switch(ej) {
        case 'ej':
          trackID  = this.$refs.revisionTrack.options[this.$refs.revisionTrack.selectedIndex].value ;
          break;
        case 'ej1':
          trackID  = this.$refs.revisionTrack1.options[this.$refs.revisionTrack1.selectedIndex].value ;
          break;
        case 'ej2':
          trackID  = this.$refs.revisionTrack2.options[this.$refs.revisionTrack2.selectedIndex].value ;
          break;
      }
      console.log(`handleRevisionTrack ${ej} ${trackID}`);
      if(this.lists.ntxTracks.indexOf(trackID) != -1) {
        console.log(`Resetting Revision`);
        switch(ej) {
          case 'ej':
            this.record.Revision.ajza[0].juz = null;
            this.record.Revision.ajza[0].portion = null;
            this.record.Revision.ajza[0].mistakes = null;
            break;
          case 'ej1':
            this.record.Revision.ajza[1].juz = null;
            this.record.Revision.ajza[1].mistakes = null;
            break;
          case 'ej2':
            this.record.Revision.ajza[2].juz = null;
            this.record.Revision.ajza[2].mistakes = null;
            break;
        }
      }
    },


    markAbsent() {
      console.log(`Absent: ${this.record.absent}`);
      // Reset all data
      this.record.NewLesson = DefaultNewLesson();
      this.record.CurrentLesson = DefaultCurrentLesson();
      this.record.Revision = DefaultRevision();
      this.record.Homework = DefaultHomework();
      this.record.NewLesson.track = 'X';
      this.record.CurrentLesson.track = 'X';
      this.record.Revision.ajza[0].track = 'X';
      this.record.Revision.ajza[1].track = 'X';
      this.record.Revision.ajza[2].track = 'X';
    },

    submitRecordDetail() {
      var sid = this.$store.state.student.id;
      var skey = this.$store.state.school.key;
      var date = this.record.SK;
      this.m_errors = [];
      if(this.record.CurrentLesson.portion != 'other') {
        this.record.CurrentLesson.other = ''
      }
      if(this.record.Homework.attachedLesson != 'other') {
        this.record.Homework.other = ''
      }

      if (this.record.NewLesson.juz > 30 || this.record.Revision.juz > 30) {
        this.m_errors.push("1 < Juz < 30");
      } else {
        delete this.m_errors;
        const api_url = `${common.getAPIBase()}record/${skey}/${sid}/${date}`;

        console.log(api_url);
        console.log(this.record);
        axios.post(api_url, this.record).then((x) => {
          console.log(x);
        });
        // to give time for dynamo db eventual consistency 
        setTimeout(() => {this.$router.push(`/student/records/${this.$store.state.student.id}`)},1000);
      }
    },
  },
};
</script>

<style>
@import url(https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css);

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

.textbox
{
    padding-top: 5px;
    padding-bottom: 5px;
}

.comment {
  width: 25%;
}

/*
select {
    background: #fff;
    color: black;
    font-size: 14px;
    border: none;
    width: 10%;
}*/

</style>