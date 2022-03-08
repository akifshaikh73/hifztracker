<template>
<div align="center">
  <form @submit.prevent="submitLogin">
        <p id="title-description" class="animate__animated animate__fadeInUp animate__delay-2s">
          A web-based application to monitor Quran memorization students' progress throughout their hifz journey. </p>
    <table>
      <tr>
        <td>School:</td>
        <input type="text" v-model="record.school" required />
      </tr>
      <tr>
        <td>Role:</td>
        <input type="text" v-model="record.role" style="text-transform:lowercase" required />
      </tr>
      
      <tr>
        <td>ID:</td>
        <input type="text" v-model="record.id"  style="text-transform:lowercase" required />
      </tr>
      <tr>
        <td>Password:</td>
        <input type="password" v-model="record.password" required />
      </tr>
    </table>
    <div>
      <button class="button button-transparent" @click.prevent="submitLogin">LOGIN</button>
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
  created() {
        var role = this.$route.params.role;
        if( role != '')
          this.record.role = role;
        var id = this.$route.params.id;
        if( id != '')
          this.record.id = id;
        console.log(`${role}-${id}`);   
        var password = this.$route.params.password;
        if( password != '')
          this.record.password = password;
  },
  methods: {
    login(loginRecord) {
      common.initAPIURL();
      const api_url = common.getAPIBase() + "login/";
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
      this.record.role = this.record.role.toLowerCase();
      if (this.record.role != "") {
        this.login(this.record)
          .then((data) => {
            console.log("Login successful+");
            console.log(this.record);
            console.log(data);
            this.error = false;
            this.$store.commit("setLogin", {
              role: this.record.role,
              schoolkey: this.record.school,
              schoolname: data.school,
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
            if (this.record.role == "student") {
              var student_path =
                "/student/records/" +this.record.id;
              console.log(student_path);
              this.$router.push(student_path);
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

<style scoped>
/* Title Section 
- Hero Background Tutorial:
  Source: https://www.youtube.com/watch?v=QA8yjuS9CQg
*/

body {
  font-family: Montserrat, sans-serif;
  overflow-x: hidden;
}

#title-section {
  margin: 0;
  overflow-x: hidden;
}

#masjid-background-image {
  height: 100vh;
  width: 100vw;
  position: relative;
  background-size: cover;
  background-position: 50% 50%;
  background-image: url("https://masjiduthman.org/wp-content/uploads/2021/04/1-1024x576.jpg");
}

#masjid-logo {
  filter: brightness(300%);
}

#overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 20% 10%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
}

#title {
  font-weight: 700;
  font-size: calc(4em + 1vw);
}

#title-description {
  font-weight: 200;
  font-size: medium;
  padding-top: 1%;
}

#buttons {
  padding: 2% 2%;
}

.button {
  background-color: #389bc2;
  width: 200px;
  border: none;
  color: white;
  padding: 16px 32px;

  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: 500;

  margin: 7.5px;

  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  cursor: pointer;
  outline: none;
  border-radius: 30px;
}

.button-transparent {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.button:hover {
  background-color: #2490d3;
}

</style>
