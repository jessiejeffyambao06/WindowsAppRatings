<?php

// SHOW ALL ERRORS (TEMPORARY DEBUG)
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

include "db.php";

// read raw input
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid JSON",
        "raw" => $raw
    ]);
    exit;
}

// CHECK FIELDS EXIST
if (!isset($data["answers"], $data["feedback"], $data["timestamp"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing fields",
        "received" => $data
    ]);
    exit;
}

// convert timestamp
$timestamp = date("Y-m-d H:i:s", strtotime($data["timestamp"]));

$answers = json_encode($data["answers"]);
$feedback = $data["feedback"];

// PREPARE QUERY
$stmt = $conn->prepare(
    "INSERT INTO ratings (answers, feedback, timestamp)
     VALUES (?, ?, ?)"
);

if (!$stmt) {
    echo json_encode([
        "status" => "error",
        "message" => $conn->error
    ]);
    exit;
}

$stmt->bind_param("sss", $answers, $feedback, $timestamp);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>