// dashboard.js — may session guard at auto-redirect kung nag-expire na ang login

function loadDashboard() {
  fetch("http://localhost/WindowsAppRatings/backend/get_ratings.php")
    .then((res) => {
      // ✅ Kung hindi authorized (403/401), i-redirect sa login
      if (res.status === 401 || res.status === 403) {
        window.location.replace("login.php");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;

      const tbody = document.querySelector("#table tbody");
      tbody.innerHTML = "";

      let veryhappy = 0;
      let happy = 0;
      let neutral = 0;
      let dissatisfied = 0;
      let verydissatisfied = 0;

      // ✅ Assign permanent number (based sa DB order)
      data.forEach((entry, index) => {
        entry.customerNumber = index + 1;
      });

      // ✅ Display newest on top
      const displayData = [...data].reverse();

      displayData.forEach((entry) => {
        let answers = entry.answers;

        if (typeof answers === "string") {
          try {
            answers = JSON.parse(answers);
          } catch {
            answers = [];
          }
        }

        let ratingsHTML = "";

        answers.forEach((a) => {
          ratingsHTML += `<div>${a.question}: <b>${a.rating}</b></div>`;

          if (a.rating === "Very Happy") veryhappy++;
          else if (a.rating === "Happy") happy++;
          else if (a.rating === "Neutral") neutral++;
          else if (a.rating === "Dissatisfied") dissatisfied++;
          else if (a.rating === "Very Dissatisfied") verydissatisfied++;
        });

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><b>${entry.customerNumber}</b></td>
          <td>${new Date(entry.timestamp).toLocaleString()}</td>
          <td>${ratingsHTML}</td>
          <td>${entry.feedback || "-"}</td>
        `;

        tbody.appendChild(tr);
      });

      document.getElementById("totalResponses").innerText = data.length;
      document.getElementById("veryhappy").innerText = veryhappy;
      document.getElementById("happy").innerText = happy;
      document.getElementById("neutral").innerText = neutral;
      document.getElementById("dissatisfied").innerText = dissatisfied;
      document.getElementById("verydissatisfied").innerText = verydissatisfied;
    })
    .catch((err) => {
      console.error("Error loading dashboard:", err);
    });
}

loadDashboard();
setInterval(loadDashboard, 3000);