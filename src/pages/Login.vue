<template>
<div align="center">
  <form @submit.prevent="submitLogin">
    <table>
      <tr>
        <td>School:</td>
        <input type="text" v-model="record.school" required />
      </tr>
      <tr>
        <td>Role:</td>
        <input type="text" v-model="record.role" required />
      </tr>
      <tr>
        <td>ID:</td>
        <input type="text" v-model="record.id" required />
      </tr>
      <tr>
        <td>Password:</td>
        <input type="password" v-model="record.password" required />
      </tr>
    </table>
    <div>
      <button @click.prevent="submitLogin">Submit</button>
    </div>
    <div v-if="error" class="error">{{ errorMessage }}</div>
  </form>
</div>
</template>
<script>
/* eslint-disable vue/no-unused-components, no-unused-vars */

import axios from "axios";
import common from "../tracker_common"

export default {
  name: "Login",
  data() {
    return {
      record: {
        school: "usem",
        role: "teacher",
        id: "",
        password: "",
      },
      error: false,
      errorMessage: "",
      loggedIn: false,
    };
  },
  created() {},
  methods: {
    login(loginRecord) {
      const api_url = common.api_base + "login/";
      console.log(api_url);
      return new Promise((resolve, reject) => {
        axios.post(api_url, this.record).then((response) => {
          if (loginRecord.role == "teacher") {
            var teacherItem = response.data.Items[0];
            if (
              response.data.Items.length == 1 
            ) {
              this.loggedIn = true;
              resolve(teacherItem);
            } else {
              reject("Invalid Login");
            }
          }
          if (loginRecord.role == "super_admin") {
            var adminItem = response.data.Item;
            console.log(adminItem);
            console.log(loginRecord);
            if (
              adminItem.LSK == loginRecord.id && adminItem.password == loginRecord.password
            ) {
              this.loggedIn = true;
              resolve(adminItem);
            } else {
              reject("Invalid Login");
            }
          }
          if (loginRecord.role == "admin") {
            var schoolItem = response.data.Item;
            console.log(schoolItem);
            console.log(loginRecord);
            if (
              schoolItem.admin.id == loginRecord.id && schoolItem.admin.password == loginRecord.password
            ) {
              this.loggedIn = true;
              resolve(schoolItem);
            } else {
              reject("Invalid Login");
            }
          }
        }).catch((error)=>{
          console.error(error);
          reject(error);
        });
      });
    },
    logout() {
      this.loggedIn = false;
    },
    isAuthenticated() {
      return this.loggedIn;
    },
    submitLogin() {
      this.errors = [];
      if (this.record.role != "") {
        this.login(this.record)
          .then((data) => {
            console.log("Login successful+" + this.record);
            this.error = false;
            this.$store.commit("setLogin", {
              role: this.record.role,
              school: this.record.school,
              name: data.name,
              id: this.record.id,
              password: this.record.password,
            });
            if (this.record.role == "teacher") {
              console.log(data);
              var path =
                "/students/" +data.SK;
              console.log(path);
              this.$router.push(path);
            }
          })
          .catch((error) => {
            console.error(typeof(error));
            console.error(error);
            this.$store.commit("resetLoginContext");
            this.error = true;
            if(typeof(error) == 'string')
              this.errorMessage = error;
            else if (typeof(error) == 'object')
              this.errorMessage = error.toString();
            else 
              this.errorMessage = error.response.data;
          });
      }
    },
  },
};
</script>
