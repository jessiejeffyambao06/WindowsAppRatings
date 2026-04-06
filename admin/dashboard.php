<?php
require_once 'auth_check.php';
?>
<!doctype html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Admin Dashboard</title>

<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="dashboard.css">

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>

<body>

<div class="layout">

  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="logo-container">
      <div class="logo-icon">🧠</div>
      <h2 class="logo">Admin Panel</h2>
    </div>

    <ul class="menu">
      <li class="active"><span class="icon">📊</span>Dashboard</li>
      <li><span class="icon">👤</span>Account Settings</li>
      <li><span class="icon">💬</span>Feedback</li>
    </ul>

    <a href="logout.php" class="logout">
      <span class="icon">🚪</span>Logout
    </a>
  </div>

  <!-- MAIN -->
  <div class="main">

    <h1>Customer Feedback Dashboard</h1>

    <!-- STATS -->
    <div class="stats">
      <div class="card"><h3>Total Responses</h3><p id="totalResponses">0</p></div>
      <div class="card"><h3>Very Happy</h3><p id="veryhappy">0</p></div>
      <div class="card"><h3>Happy</h3><p id="happy">0</p></div>
      <div class="card"><h3>Neutral</h3><p id="neutral">0</p></div>
      <div class="card"><h3>Dissatisfied</h3><p id="dissatisfied">0</p></div>
      <div class="card"><h3>Very Dissatisfied</h3><p id="verydissatisfied">0</p></div>
    </div>

    <!-- ANALYTICS -->
    <div class="analytics">
      <div class="chart-card">
        <h2>Sentiment Distribution</h2>
        <canvas id="sentimentChart"></canvas>
      </div>
      <div class="chart-card">
        <h2>Rating Breakdown</h2>
        <canvas id="ratingChart"></canvas>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-container">
      <h2>Recent Feedback</h2>

      <table id="table">
        <thead>
          <tr>
            <th>Customer #</th>
            <th>Date</th>
            <th>Ratings</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

    </div>

  </div>
</div>

<script src="dashboard.js"></script>

<script>
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    fetch('session_check.php')
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          window.location.replace('login.php');
        }
      });
  }
});
</script>

</body>
</html>