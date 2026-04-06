<?php
// session_check.php
// Ginagamit ng dashboard.js para i-verify kung naka-login pa ang admin.
// Kapag expired na ang session (nag-logout), ibinabalik na false.

session_start();
header('Content-Type: application/json');

echo json_encode([
    'logged_in' => isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true
]);