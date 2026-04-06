<?php
session_start();

// ─── Load .env ───────────────────────────────────────────────────
function loadEnv(string $path): void {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

// ⚠️ Ilagay ang .env sa LABAS ng public folder para extra secure.
// Halimbawa kung ang public folder mo ay: C:/xampp/htdocs/WindowsAppRatings/
// Ilagay ang .env sa:               C:/xampp/htdocs/.env
// Tapos baguhin ang path dito:
loadEnv(__DIR__ . '/../.env');

$ADMIN_USER = $_ENV['ADMIN_USERNAME'] ?? '';
$ADMIN_PASS = $_ENV['ADMIN_PASSWORD'] ?? '';

// ─── If already logged in, redirect to dashboard ─────────────────
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.html');
    exit;
}

$error = '';

// ─── Handle POST (login form submit) ─────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === $ADMIN_USER && $password === $ADMIN_PASS) {
        // Regenerate session ID para maiwasan ang session fixation attacks
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user']      = $username;

        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Mali ang username o password.';
    }
}
?>
<!doctype html>
<html lang="fil">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login</title>

  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: radial-gradient(circle at top, #0f172a, #020617);
      color: #e2e8f0;
    }

    .card {
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(15px);
      padding: 35px;
      border-radius: 18px;
      box-shadow: 0 0 40px rgba(56, 189, 248, 0.25);
      border: 1px solid rgba(56, 189, 248, 0.2);
      text-align: center;
      width: 320px;
      position: relative;
    }

    .card h2 {
      font-family: 'Orbitron', sans-serif;
      margin-bottom: 5px;
      font-size: 26px;
      color: #38bdf8;
      letter-spacing: 1px;
    }

    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 20px;
    }

    input {
      display: block;
      margin: 12px 0;
      padding: 12px;
      width: 100%;
      border-radius: 10px;
      border: 1px solid rgba(148, 163, 184, 0.2);
      background: rgba(2, 6, 23, 0.9);
      color: #e2e8f0;
      transition: 0.3s;
      font-family: 'Inter', sans-serif;
    }

    input::placeholder { color: #64748b; }

    input:focus {
      outline: none;
      border: 1px solid #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
    }

    button {
      padding: 12px;
      width: 100%;
      margin-top: 10px;
      border-radius: 25px;
      border: none;
      background: linear-gradient(to right, #38bdf8, #6366f1);
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
    }

    button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.6);
    }

    .error {
      margin-top: 12px;
      font-size: 13px;
      color: #f87171;
      min-height: 18px;
    }

    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 18px;
      background: linear-gradient(120deg, transparent, rgba(56, 189, 248, 0.2), transparent);
      opacity: 0.3;
      pointer-events: none;
    }

    .footer {
      margin-top: 15px;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>

<body>
  <div class="card">
    <h2>Admin Login</h2>
    <div class="subtitle">Secure Access • Feedback Dashboard</div>

    <!-- PHP form — credentials processed sa server side, hindi JS -->
    <form method="POST" action="login.php" autocomplete="off">
      <input
        type="text"
        name="username"
        placeholder="Username"
        required
        autocomplete="off"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>

    <p class="error"><?= htmlspecialchars($error) ?></p>

    <div class="footer">© Ziontech Feedback System</div>
  </div>
</body>
</html>