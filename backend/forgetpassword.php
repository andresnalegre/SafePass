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
    $username = $_POST['username'];
    $newPassword = $_POST['newPassword'];

    try {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        $stmt = $conn->prepare("SELECT * FROM users WHERE user = :username");
        $stmt->execute(['username' => $username]);

        if ($stmt->rowCount() > 0) {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE users SET password = :password WHERE user = :username");
            $stmt->execute(['password' => $hashedPassword, 'username' => $username]);
            echo json_encode(['success' => true, 'message' => MESSAGES['passwordUpdated']]);
        } else {
            echo json_encode(['success' => false, 'message' => MESSAGES['userNotFound']]);
        }
    } catch (Exception $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => MESSAGES['serverError']]);
    }
}
?>