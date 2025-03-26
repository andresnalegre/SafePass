<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include_once 'database.php';

const MESSAGES = [
    'enterCredentials' => 'Enter your username and password.',
    'enterUsername' => 'Enter your username.',
    'enterPassword' => 'Enter your password.',
    'loginSuccess' => 'Welcome, ',
    'invalidCredentials' => 'Username or password is incorrect!',
    'serverError' => 'Error connecting to server.'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) && empty($password)) {
        echo json_encode(['success' => false, 'message' => MESSAGES['enterCredentials']]);
        exit;
    } elseif (empty($username)) {
        echo json_encode(['success' => false, 'message' => MESSAGES['enterUsername']]);
        exit;
    } elseif (empty($password)) {
        echo json_encode(['success' => false, 'message' => MESSAGES['enterPassword']]);
        exit;
    }

    try {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                echo json_encode([
                    'success' => true,
                    'message' => MESSAGES['loginSuccess'] . $user['username'] . '!',
                    'user_id' => $user['id']
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['invalidCredentials']]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => MESSAGES['invalidCredentials']]);
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => MESSAGES['serverError']]);
    }
}
?>