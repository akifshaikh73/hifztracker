<template>

    <table align="center">
      <tr>
        <th>Seminary Name</th>        
        <!--td>Location</th-->        
      <tr>
      <tr v-for='school in schools' v-bind:key='school.SK'>
        <td>
        <router-link :to="{ name: 'teachers' , params: {skey:school.SK}}">    
            {{school.name}}
        </router-link>
        </td>
        <!--td>
        {{school.location}}
        </td-->
      </tr>
    </table>
    
</template>

<script>
import axios from "axios";
import common from "../tracker_common"



export default {
  name: "SchoolList",
  data() {
    return {
      schools:[]
    };
  },
  created() {
    common.initAPIURL();
    const api_url = common.getAPIBase() + "schools/";
    axios.get(api_url).then((x) => {
      console.log(x);
      this.schools = x.data.Items;
    });
  },
};


</script>
