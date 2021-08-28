var api_base = '';

const api_map = {
    "local": "http://localhost:8081/",
    "dev"  : "https://0ebo0d0gh6.execute-api.us-east-2.amazonaws.com/default/",
    "prod" : "https://bopm3y50fk.execute-api.us-east-2.amazonaws.com/prod/"
}

const m_programs = {
    "hifz":"Hifz",
    "phifz":"Part time Hifz",
    "maktab":"Maktab"
}

const m_portions_revision = {
    "full" : "Full Juz",
    "h1":"1st Half",
    "h2":"2nd Half",
    "q1":"1st Quarter",
    "q2":"2nd Quarter",
    "q3":"3rd Quarter",
    "q4":"4th Quarter",
    }

const m_portions_attached = {
    "current" : "Beginning to Current",
    "l5":"Last 5 pages",
    "l10":"Last 10 pages",
    "l20":"Last 20 pages",
    "h1":"1st Half",
    "h2":"2nd Half",
    "other":"Other"
}

const m_mistakes = {
    "0-1":"0-1",
    "2-5":"2-5",
    "6-10":"6-10",
    "11-20":"11-20",
    "21-35":"21-35",
    "36+":"36+"
}

const m_days = {
    "0":"Mon",
    "1":"Tue",
    "2":"Wed",
    "3":"Thu",
    "4":"Fri",
    "5":"Sat",
    "6":"Sun"
}


const m_tracks = {
    "P":"Passed",
    "R":"Recited but Not Passed",
    "A":"Assigned but Not Recited",
    "N":"Not Assigned",
    "T":"Juz Test",
    "X":"Absent, Early Out, Tardy"
}

const m_styles = {
    "P":"passed",
    "R":"attempted",
    "A":"failed",
    "N":"",
    "T":"",
    "X":"absent"
}

function initAPIURL() {
    console.log(window.location.origin);
    var urlpath = window.location.origin;
    if(urlpath.indexOf("localhost") >0 )
      api_base = api_map["local"];
    if(urlpath.indexOf("hifztracker.s3") > 0)
      api_base = api_map["dev"];
    if(urlpath.indexOf("hifztrackerp.s3") > 0)
      api_base = api_map["prod"];
    console.log(`API BASE URL: ${api_base}`)  ;
}

function getAPIBase() {
    return api_base;
}

 function DefaultNewLesson() {
    return {
      juz: 1,
      lines: 1,
      track : "P"
    };
  }
  
 function DefaultHomework() {
    return {
      /*
      juz: 1,
      ayahs: "1-10",
      track : "P"
      */
    };
  }
  
  
 function DefaultCurrentLesson() {
    return {
      portion: "current",
      other:"",
      track: "P"
    };
  }
  
 function DefaultRevision() {
    return {
      //portion: "full",
      //juz: 1,
      //mistakes: "0-1",
      //track: "P",
      extraJuz : false,
      ajza: [
        {
          juz:1,
          portion: "full",
          mistakes: "0-1",
          track: "P",
        },
        {
          juz:2,
          mistakes: "0-1",
          track: "P",
        },
        {
          juz:3,
          mistakes: "0-1",
          track: "P",
        }
      ]
    };
  }
  
module.exports = { api_base ,api_map, 
    m_portions_attached,m_portions_revision,m_mistakes,m_tracks,m_programs, m_styles,m_days,
    DefaultNewLesson,DefaultHomework,DefaultCurrentLesson,DefaultRevision,
    initAPIURL,getAPIBase}