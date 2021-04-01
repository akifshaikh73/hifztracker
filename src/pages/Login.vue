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
    <div v-if="record.error">{{ record.errorMessage }}</div>
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
        loggedIn: false,
        error: false,
        errorMessage: "",
      },
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
              loginRecord.loggedIn = true;
              resolve(teacherItem);
            } else {
              reject();
            }
          }
          if (loginRecord.role == "super_admin") {
            var adminItem = response.data.Item;
            console.log(adminItem);
            console.log(loginRecord);
            if (
              adminItem.key == loginRecord.id && adminItem.password == loginRecord.password
            ) {
              loginRecord.loggedIn = true;
              resolve(adminItem);
            } else {
              reject();
            }
          }
          if (loginRecord.role == "admin") {
            var schoolItem = response.data.Item;
            console.log(schoolItem);
            console.log(loginRecord);
            if (
              schoolItem.admin.id == loginRecord.id && schoolItem.admin.password == loginRecord.password
            ) {
              loginRecord.loggedIn = true;
              resolve(schoolItem);
            } else {
              reject();
            }
          }
        }).catch((error)=>{
          console.error(error);
          reject(error);
        });
      });
    },
    logout() {
      this.record.loggedIn = false;
    },
    isAuthenticated() {
      return this.record.loggedIn;
    },
    submitLogin() {
      this.record.errors = [];
      if (this.record.role != "") {
        this.login(this.record)
          .then((data) => {
            console.log("Login successful+" + this.record);
            this.record.error = false;
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
                "/students/" +data.id;
              console.log(path);
              this.$router.push(path);
            }
          })
          .catch((error) => {
            console.log("Login failed+" + this.record);
            console.error(error);
            this.$store.commit("resetLoginContext");
            this.record.error = true;
            this.record.errorMessage = "Invalid Login or Password";
          });
      }
    },
  },
};
</script>
