<?php
// ─── auth_check.php ───────────────────────────────────────────────
// I-include ito sa SIMULA ng lahat ng protected pages (dashboard, etc.)
// Kung hindi logged in → back sa login, hindi makapasok.

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // I-clear ang session para sigurado
    session_unset();
    session_destroy();

    // Redirect sa login
    header('Location: login.php');
    exit;
}