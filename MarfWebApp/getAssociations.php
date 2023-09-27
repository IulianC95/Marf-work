<?php
$servername = "localhost";
$username = "u225698808_iulian";
$password = "Iulian23#";
$dbname = "u225698808_asoc";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT name FROM Associations";
$result = $conn->query($sql);

$associations = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $associations[] = $row["name"];
    }
}

echo json_encode($associations);

$conn->close();
?>
