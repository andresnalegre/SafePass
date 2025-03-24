<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include_once 'database.php';

const USERNAME_PASSWORD_REQUIRED = 'Username and password are required!';
const INVALID_USERNAME = 'Use only lowercase letters and numbers!';
const USERNAME_EXISTS = 'Username already exists!';
const REGISTRATION_SUCCESS = 'User registered successfully!';
const SERVER_ERROR = 'Server error: Verify connection and try again!';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? null;
    $password = $_POST['password'] ?? null;

    if (!$username || !$password) {
        echo json_encode(['success' => false, 'message' => USERNAME_PASSWORD_REQUIRED]);
        exit();
    }

    if (!preg_match('/^[a-z0-9]+$/', $username)) {
        echo json_encode(['success' => false, 'message' => INVALID_USERNAME]);
        exit();
    }

    try {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("SELECT * FROM users WHERE user = :username");
        $stmt->execute(['username' => $username]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => USERNAME_EXISTS]);
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO users (user, password) VALUES (:username, :password)");
            $stmt->execute(['username' => $username, 'password' => $hashedPassword]);
            echo json_encode(['success' => true, 'message' => REGISTRATION_SUCCESS]);
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => SERVER_ERROR]);
    }
}
?>