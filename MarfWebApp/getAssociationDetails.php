<?php
$servername = "localhost";
$username = "u225698808_iulian";
$password = "Iulian23#";
$dbname = "u225698808_asoc";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
if (is_null($data)) {
    die(json_encode(["status" => "error", "message" => "Invalid JSON"]));
}

$name = $data['name'];

$stmt = $conn->prepare("SELECT * FROM Associations WHERE name = ?");
$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode($row);
    } else {
        echo json_encode(["status" => "error", "message" => "No result found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
