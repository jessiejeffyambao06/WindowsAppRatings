<?php
header("Content-Type: application/json");
include "db.php";

$result = $conn->query("SELECT * FROM ratings ORDER BY id ASC");
$data = [];
while($row = $result->fetch_assoc()){
    $data[] = $row;
}
echo json_encode($data);
$conn->close();
?>