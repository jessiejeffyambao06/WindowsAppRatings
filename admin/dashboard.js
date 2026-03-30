function loadDashboard() {
  fetch("http://localhost/WindowsAppRatings/backend/get_ratings.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#table tbody");
      tbody.innerHTML = "";

      let veryhappy = 0;
      let happy = 0;
      let neutral = 0;
      let dissatisfied = 0;
      let verydissatisfied = 0;

      // ✅ assign permanent number (based sa DB order)
      data.forEach((entry, index) => {
        entry.customerNumber = index + 1;
      });

      // ✅ display newest on top
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
    });
}

loadDashboard();
setInterval(loadDashboard, 3000);