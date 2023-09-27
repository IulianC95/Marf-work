<?php
$servername = "localhost";
$username = "u225698808_iulian";
$password = "Iulian23#";
$dbname = "u225698808_asoc";

// Crearea conexiunii
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificarea conexiunii
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Colectarea datelor din cererea POST
$data = json_decode(file_get_contents('php://input'), true);
if (is_null($data)) {
    die("Invalid JSON");
}

$name = $data['name'];
$address = $data['address'];
$president = $data['president'];
$street = $data['street'];
$nr = $data['nr'];
$bloc = $data['bloc'];
$localitate = $data['localitate'];
$judet = $data['judet'];
$cif = $data['cif'];

// Pregătirea și executarea interogării pentru tabela "Associations"
$stmt = $conn->prepare("INSERT INTO Associations (name, address, president, street, nr, bloc, localitate, judet, cif) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssss", $name, $address, $president, $street, $nr, $bloc, $localitate, $judet, $cif);  // Notice the change here

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
