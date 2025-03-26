<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include_once 'database.php';

const MESSAGES = [
    'userNotFound' => 'User was not found! Please check the username and try again.',
    'passwordUpdated' => 'Password updated successfully!',
    'serverError' => 'Error connecting to server.'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? null;
    $newPassword = $_POST['newPassword'] ?? null;

    if (!$username || !$newPassword) {
        echo json_encode(['success' => false, 'message' => MESSAGES['userNotFound']]);
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
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
            $stmt->bind_param("ss", $hashedPassword, $username);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => MESSAGES['passwordUpdated']]);
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['serverError']]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => MESSAGES['userNotFound']]);
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => MESSAGES['serverError']]);
    }
}
?>