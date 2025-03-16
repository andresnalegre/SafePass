<?php
session_start(); // Iniciar a sessão
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT");
header("Content-Type: application/json");

include_once 'database.php';

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_SESSION['user_id'])) {
            $userId = $_SESSION['user_id'];
            $username = $_SESSION['username'];
            echo json_encode(['success' => true, 'user_id' => $userId, 'username' => $username]);
        } else {
            // Buscar senhas
            $stmt = $conn->prepare("SELECT id, title, username, password FROM dashboard");
            $stmt->execute();
            $passwords = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'passwords' => $passwords]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $title = $_POST['title'] ?? null;
        $username = $_POST['username'] ?? null;
        $password = $_POST['password'] ?? null;
        $created_by = $_SESSION['user_id'] ?? '';

        if ($title && $username && $password) {
            $stmt = $conn->prepare("INSERT INTO dashboard (title, username, password, created_by) VALUES (:title, :username, :password, :created_by)");
            $stmt->execute(['title' => $title, 'username' => $username, 'password' => $password, 'created_by' => $created_by]);
            echo json_encode(['success' => true, 'message' => 'Password created successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents("php://input"), $data);
        $id = $_GET['id'] ?? null;
        $title = $data['title'] ?? null;
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;

        if ($id && $title && $username && $password) {
            $stmt = $conn->prepare("UPDATE dashboard SET title = :title, username = :username, password = :password WHERE id = :id");
            $stmt->execute(['title' => $title, 'username' => $username, 'password' => $password, 'id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing required fields for update']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents("php://input"), $data);
        $id = $data['id'] ?? null;

        if ($id) {
            $stmt = $conn->prepare("DELETE FROM dashboard WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Password deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Missing ID for deletion']);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>