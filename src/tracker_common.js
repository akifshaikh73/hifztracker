const api_base = "http://localhost:8081/";

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
    "current" : "To Current",
    "l5":"Last 5",
    "l10":"Last 10",
    "l20":"Last 20",
    "h1":"1st Half",
    "h2":"2nd Half",
}

const m_mistakes = {
    "0-1":"0-1",
    "2-5":"2-5",
    "6-10":"6-10",
    "11-20":"11-20",
    "21-35":"21-35",
    "36":"36+"
}

const m_tracks = {
    "P":"Passed",
    "R":"Recited but Not Passed",
    "A":"Assigned but Not Recited",
    "N":"Not Assigned",
    "T":"Juz Test",
    "X":"Absent,Early Out,Tardt"
}

module.exports = { api_base, m_portions_attached,m_portions_revision,m_mistakes,m_tracks,m_programs}