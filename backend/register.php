<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include_once 'database.php';

const MESSAGES = [
    'usernamePasswordRequired' => 'Username and password are required!',
    'invalidUsername' => 'Use only lowercase letters and numbers!',
    'usernameExists' => 'Username already exists!',
    'registrationSuccess' => 'User registered successfully!',
    'serverError' => 'Server error: Verify connection and try again!'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? null;
    $password = $_POST['password'] ?? null;

    if (!$username || !$password) {
        echo json_encode(['success' => false, 'message' => MESSAGES['usernamePasswordRequired']]);
        exit();
    }

    if (!preg_match('/^[a-z0-9]+$/', $username)) {
        echo json_encode(['success' => false, 'message' => MESSAGES['invalidUsername']]);
        exit();
    }

    try {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => MESSAGES['usernameExists']]);
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $username, $hashedPassword);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => MESSAGES['registrationSuccess']]);
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['serverError']]);
            }
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => MESSAGES['serverError']]);
    }
}
?>