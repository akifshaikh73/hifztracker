<template>
  <div align="center">
  <div>
   <h5> Student Tracking: </h5>
    <video width="320" height="240" controls="controls">
      <source src="@/assets/student_tracking.mp4"  type="video/mp4; codecs=avc1.42E01E, mp4a.40.2"> />
      Your browser does not support the video tag. /* instead of the last line
      you could also add the flash player*/
    </video>
   </div> 
  <hr/> 
  <div v-if="$store.state.login.role == 'teacher'">
   <h5> Teacher Role: </h5>
    <video width="320" height="240" controls="controls">
      <source src="@/assets/teacher.mp4"  type="video/mp4; codecs=avc1.42E01E, mp4a.40.2"> />
      Your browser does not support the video tag. /* instead of the last line
      you could also add the flash player*/
    </video>
   </div> 
  <!--div>
   <h1> General </h1>
    <video width="320" height="240" controls="controls">
      <source src="@/assets/admin.mp4"  type="video/mp4; codecs=avc1.42E01E, mp4a.40.2"> />
      Your browser does not support the video tag. /* instead of the last line
      you could also add the flash player*/
    </video>
   </div--> 

  </div>
</template>
