<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $newPassword = $_POST['newPassword'];

    try {
        $db = Database::getInstance();
        $conn = $db->getConnection();

        // Use o nome correto do campo do banco de dados
        $stmt = $conn->prepare("SELECT * FROM users WHERE user = :username");
        $stmt->execute(['username' => $username]);

        if ($stmt->rowCount() > 0) {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            // Use o nome correto do campo do banco de dados
            $stmt = $conn->prepare("UPDATE users SET password = :password WHERE user = :username");
            $stmt->execute(['password' => $hashedPassword, 'username' => $username]);
            echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>