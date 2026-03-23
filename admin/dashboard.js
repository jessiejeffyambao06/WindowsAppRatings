function loadDashboard() {
  fetch("http://localhost/WindowsAppRatings/backend/get_ratings.php")
    .then((res) => res.json())
    .then((data) => {
      console.log("DATA FROM API:", data);

      const tbody = document.querySelector("#table tbody");

      let veryhappy = 0;
      let happy = 0;
      let neutral = 0;
      let dissatisfied = 0;
      let verydissatisfied = 0;

      tbody.innerHTML = "";

      data.forEach((entry, index) => {
        // SAFE JSON PARSE
        let answers = entry.answers;

        if (typeof answers === "string") {
          try {
            answers = JSON.parse(answers);
          } catch (e) {
            console.error("Invalid JSON:", entry.answers);
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
                    <td><b>${index + 1}</b></td>
                    <td>${new Date(entry.timestamp).toLocaleString()}</td>
                    <td>${ratingsHTML}</td>
                    <td>${entry.feedback || "-"}</td>
                `;

        tbody.appendChild(tr);
      });

      // UPDATE COUNTERS
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

// INITIAL LOAD
loadDashboard();

// AUTO REFRESH EVERY 3 SECONDS
setInterval(loadDashboard, 3000);
