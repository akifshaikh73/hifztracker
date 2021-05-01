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
            if (response.data.valid) {
              var responseItem = response.data.Item;
              this.loggedIn = true;
              resolve(responseItem);
            } else {
              reject("Invalid Login");
            }
            console.log(loginRecord);
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
      this.record.id = this.record.id.toLowerCase();
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
              var path =
                "/students/" +this.record.id;
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
            if (typeof(error) == 'object') {
              this.errorMessage = error.toString();
              if(error.response != undefined)
                this.errorMessage = error.response.data;
            }
          });
      }
    },
  },
};
</script>
