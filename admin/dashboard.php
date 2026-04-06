<?php
require_once 'auth_check.php'; // 🔒 Protected — hindi makapasok kung hindi logged in
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Dashboard</title>

  <!-- ✅ Prevents browser from caching this page -->
  <!-- So pag pinindot ang back button after logout, hindi maglo-load ulit -->
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />

  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="dashboard.css" />
</head>

<body>
  <div class="layout">
    <div class="sidebar">
      <div class="logo-container">
        <div class="logo-icon">🧠</div>
        <h2 class="logo">Admin Panel</h2>
      </div>

      <ul class="menu">
        <li class="active">
          <span class="icon">📊</span>
          <span>Dashboard</span>
        </li>
        <li>
          <span class="icon">👤</span>
          <span>Account Settings</span>
        </li>
        <li>
          <span class="icon">💬</span>
          <span>Feedback</span>
        </li>
      </ul>

      <!-- ✅ Logout button — link na sa logout.php -->
      <a href="logout.php" class="logout" style="text-decoration: none; color: inherit;">
        <span class="icon">🚪</span>
        <span>Logout</span>
      </a>
    </div>

    <div class="main">
      <h1>Customer Feedback Dashboard</h1>

      <div class="stats">
        <div class="card">
          <h3>Total Responses</h3>
          <p id="totalResponses">0</p>
        </div>
        <div class="card">
          <h3>Very Happy</h3>
          <p id="veryhappy">0</p>
        </div>
        <div class="card">
          <h3>Happy</h3>
          <p id="happy">0</p>
        </div>
        <div class="card">
          <h3>Neutral</h3>
          <p id="neutral">0</p>
        </div>
        <div class="card">
          <h3>Dissatisfied</h3>
          <p id="dissatisfied">0</p>
        </div>
        <div class="card">
          <h3>Very Dissatisfied</h3>
          <p id="verydissatisfied">0</p>
        </div>
      </div>

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
    // ✅ Extra layer: pag pinindot ang back button mula sa ibang page
    // at nag-load ulit ang dashboard, i-check kung may session pa.
    // Kung wala na (nag-logout na), redirect sa login.
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        // Page galing sa bfcache (browser back/forward cache)
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