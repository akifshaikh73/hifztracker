<template>
  <div align="center">
    
    <div>
      <span>Show All Records: </span>
      <input type="checkbox" v-model="showAllRecords" required  @input="showRecords()"/>
    </div>
     <div style="font-size:x-small">
       Please note that not all data elements are shown in this summarized report. To see details, please click the Date link
     </div>
    <table class="table-bordered table">
      <thead>
      <tr border="1">
        <th colspan="1" ></th>
        <th colspan="3" style="text-align:center">New Lesson</th>
        <th colspan="2" style="text-align:center">Attached</th>
        <th v-if="$store.state.login.role != 'student'" colspan="5" style="text-align:center">Revision</th>
        <th v-if="$store.state.login.role == 'student'" colspan="4" style="text-align:center">Revision</th>
        <th v-if="$store.state.login.role == 'student'" colspan="3" style="text-align:center">Homework</th>
      </tr>
      <tr>
        <th width="125px">Day-Date</th>
        <th>Juz</th>
        <th>Lines</th>
        <th>Track</th>
        <th width="120px">Portion</th>
        <th>Track</th>
        <th>Juz</th>
        <th width="120px">Portion</th>
        <th>Mistakes</th>
        <th>Track</th>
        <th v-if="$store.state.login.role == 'student'">New</th>
        <th v-if="$store.state.login.role == 'student'">Attached</th>
        <th v-if="$store.state.login.role == 'student'">Revision</th>
        <th v-if="$store.state.login.role == 'teacher'">Action</th>
      </tr>
      </thead>
      <tbody>

      <tr v-for="record in records" :key="record.SK">
        <td>
          <router-link
            :to="{
                name: 'record_detail',
                params: { skey: $store.state.school.key,
                student_id:$store.state.student.id,
                record_id: record.SK 
              },
            }"
          >
            {{ m_days[new Date(record.SK).getDay()] }}-{{new Date(record.SK).getUTCMonth()+1}}/{{new Date(record.SK).getUTCDate()}}
          </router-link>
        </td>
        <td v-if="record.NewLesson.track == 'X'" colspan="3" class="absent">
          Absent 
        </td>
          <td v-if="record.NewLesson.track != 'X'">
            {{ record.NewLesson.juz }}
          </td>
          <td v-if="record.NewLesson.track != 'X'">
            {{ record.NewLesson.lines }}
          </td>
          <td v-if="record.NewLesson.track != 'X'" :class="m_styles[record.NewLesson.track]">
            {{ record.NewLesson.track }}
          </td>
        <td v-if="record.CurrentLesson.track == 'X'" colspan="2" class="absent">
          Absent
        </td>
        <td v-if="record.CurrentLesson.track != 'X'">
          {{ lists.portions_attached[record.CurrentLesson.portion] }}
        </td>
        <td v-if="record.CurrentLesson.track != 'X'" :class="m_styles[record.CurrentLesson.track]">
          {{ record.CurrentLesson.track }}
        </td>

        <td v-if="record.Revision.ajza[0].track == 'X'" colspan="4" class="absent">
          Absent
        </td>
        <td v-if="record.Revision.ajza[0].track != 'X'">
          {{ record.Revision.ajza[0].juz }}
        </td>
        <td v-if="record.Revision.ajza[0].track != 'X'">
          {{ lists.portions_revision[record.Revision.ajza[0].portion] }}
        </td>
        <td v-if="record.Revision.ajza[0].track != 'X'">
          {{ record.Revision.ajza[0].mistakes }}
        </td>
        <td v-if="record.Revision.ajza[0].track != 'X'" :class="m_styles[record.Revision.ajza[0].track]">
          {{ record.Revision.ajza[0].track }}
        </td>
        <td v-if="$store.state.login.role == 'student'">
          {{ record.Homework.newLesson }}
        </td>
        <td v-if="$store.state.login.role == 'student'">
          {{ record.Homework.attachedLesson }}
        </td>
        <td v-if="$store.state.login.role == 'student'">
          {{ record.Homework.revision }}
        </td>

        <td v-if="$store.state.login.role == 'teacher'">
          <button @click="removeRecord(record.SK)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="$store.state.login.role == 'teacher'">
      <button @click="newRecordDetail">Add Record</button>
    </div>
  <div style="font-size:x-small;">
    <table>
    <tr style="font-weight: bold;"> Legend: </tr>
    <tr>
    </tr>    
    <tbody>
    <tr v-for="(track,index) in Object.keys(lists.tracks)" :key="index"> 
      {{track}}-{{lists.tracks[track]}}
      </tr>
    </tbody>  
    </table>
  </div>  

  </div>

</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import { DefaultCurrentLesson, DefaultRevision } from "../tracker_common";

import common from "../tracker_common";

export default {
  name: "Records",
  data() {
    return {
      m_styles : common.m_styles,
      m_days: common.m_days,
      showAllRecords : false,
      records: [],
      lists: {
        portions_attached: common.m_portions_attached,
        portions_revision: common.m_portions_revision,
        tracks : common.m_tracks

      },
    };
  },
  created() {
    var page = this.$route.params.page;
    common.initAPIURL();
    this.refreshList(page);
  },
  methods: {
    showRecords() {
      console.log(this.showAllRecords);
      if(!this.showAllRecords)
        this.refreshList('all');
      else  
        this.refreshList(1);
    },
    refreshList(page) {

      var sid = this.$route.params.student_id;
      var skey = this.$store.state.school.key;

      const api_url = `${common.getAPIBase()}records/${skey}/${sid}/${page}`;
      console.log(`refreshList ${api_url}`);
      axios.get(api_url).then((x) => {
        console.log(x);
        this.records = x.data.filter((record) =>
          record.PK.includes("dtracker::" + skey)
        );
        if(this.records[0] != undefined) {
          var lastRecordDate = this.records[0].SK;
          this.$store.commit("setlastRecordDate", lastRecordDate);
        } else {
          this.$store.commit("resetlastRecordDate");
        }
        var students = x.data.filter(
          (record) => record.PK == "student::" + skey
        );
        var sname = "";
        if (students.length > 0) {
          sname = students[0].name;
          this.$store.commit("setStudentObject", { name: sname, id: sid });
          if (this.$store.state.login.role == '')
                this.$router.push("/login");
        }

        this.records.forEach((record) => {
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
      const api_url = `${common.getAPIBase()}record/${skey}/${sid}/${tracker_date}`;
      console.log(api_url);
      axios.delete(api_url, this.record).then((x) => {
        console.log(x);
      });
      setTimeout(() => {
        this.refreshList(1);
        },1000);
    },
    newRecordDetail() {
      if(this.records.length > 0 ) {
        // Store the latest record in the state - so it can be defaulted for a new record
        var lastRecrod = this.records[0];
        console.log(lastRecrod);
        this.$store.commit("setlastRecord", lastRecrod);
      }
      this.$router.push({
        name: "record_detail",
        params: { record_id: "new" },
      });
    },
  },
};
</script>
<style scoped>
.absent {
  background-color: rgba(0, 174, 255, 0.651);
}
.attempted {
  background-color: rgba(255, 145, 0, 0.336);
}

.failed {
  background-color: rgba(255, 51, 0, 0.336);
}

.passed {
  background-color: rgba(0, 255, 21, 0.699);
}

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>