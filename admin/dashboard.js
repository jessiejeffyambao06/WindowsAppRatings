let trendChart = null;
let sentimentChart = null;

function loadDashboard() {

  fetch("http://localhost/WindowsAppRatings/backend/get_ratings.php")
  .then(res => {
    if (res.status === 401 || res.status === 403) {
      window.location.replace("login.php");
      return null;
    }
    return res.json();
  })
  .then(data => {

    if (!data || !Array.isArray(data)) return;

    const tbody = document.querySelector("#table tbody");
    tbody.innerHTML = "";

    let veryhappy=0, happy=0, neutral=0, dissatisfied=0, verydissatisfied=0;
    let dailyCount = {};

    // ✅ FIXED HERE
    let totalResponses = data.length;

    data.forEach((entry,index)=>{

      entry.customerNumber = index+1;

      let answers = [];
      try {
        answers = typeof entry.answers === "string" ? JSON.parse(entry.answers) : (entry.answers || []);
      } catch { answers = []; }

      // ❌ tinanggal na: totalResponses += answers.length;

      answers.forEach(a=>{
        if(a.rating==="Very Happy") veryhappy++;
        else if(a.rating==="Happy") happy++;
        else if(a.rating==="Neutral") neutral++;
        else if(a.rating==="Dissatisfied") dissatisfied++;
        else if(a.rating==="Very Dissatisfied") verydissatisfied++;
      });

      const dateKey = new Date(entry.timestamp).toLocaleDateString();
      dailyCount[dateKey] = (dailyCount[dateKey]||0)+1;
    });

    // TABLE
    [...data].reverse().forEach(entry=>{
      let answers=[];
      try{
        answers = typeof entry.answers==="string" ? JSON.parse(entry.answers) : (entry.answers||[]);
      } catch { answers=[]; }

      let ratingsHTML="";
      answers.forEach(a=>{
        ratingsHTML+=`<div>${a.question}: <b>${a.rating}</b></div>`;
      });

      const tr=document.createElement("tr");
      tr.innerHTML=`
        <td><b>${entry.customerNumber}</b></td>
        <td>${new Date(entry.timestamp).toLocaleString()}</td>
        <td>${ratingsHTML}</td>
        <td>${entry.feedback||"-"}</td>
      `;
      tbody.appendChild(tr);
    });

    // STATS
    document.getElementById("totalResponses").innerText=totalResponses;
    document.getElementById("veryhappy").innerText=veryhappy;
    document.getElementById("happy").innerText=happy;
    document.getElementById("neutral").innerText=neutral;
    document.getElementById("dissatisfied").innerText=dissatisfied;
    document.getElementById("verydissatisfied").innerText=verydissatisfied;

    createCharts(dailyCount,[veryhappy,happy,neutral,dissatisfied,verydissatisfied]);
  })
  .catch(err=>console.error("Dashboard Error:",err));
}

function createCharts(dailyData,sentimentData){

  // LINE CHART
  if(trendChart) trendChart.destroy();
  trendChart = new Chart(document.getElementById("ratingChart"),{
    type:"line",
    data:{
      labels:Object.keys(dailyData),
      datasets:[{
        label:"Daily Feedback",
        data:Object.values(dailyData),
        borderWidth:2,
        tension:0.3,
        borderColor:"#38bdf8",
        backgroundColor:"rgba(56,189,248,0.1)",
        fill:true
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:"#e2e8f0"}} },
      scales:{
        x:{ ticks:{ color:"#94a3b8"}},
        y:{ ticks:{ color:"#94a3b8"}, beginAtZero:true}
      }
    }
  });

  // DOUGHNUT
  if(sentimentChart) sentimentChart.destroy();
  sentimentChart = new Chart(document.getElementById("sentimentChart"),{
    type:"doughnut",
    data:{
      labels:["Very Happy","Happy","Neutral","Dissatisfied","Very Dissatisfied"],
      datasets:[{
        data:sentimentData,
        backgroundColor:["#22c55e","#4ade80","#facc15","#fb923c","#ef4444"]
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      cutout:"60%",
      plugins:{ legend:{ labels:{ color:"#e2e8f0"}} }
    }
  });
}

loadDashboard();

// refresh every 10s
setInterval(loadDashboard,10000);