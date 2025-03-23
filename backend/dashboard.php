<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();

    function getPasswords($conn, $username) {
        try {
            $stmt = $conn->prepare("SELECT id, title, username, password FROM dashboard WHERE created_by = :username");
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->execute();
            
            $passwords = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'passwords' => $passwords ?: [], 'message' => $passwords ? '' : 'No passwords found'];
        } catch (PDOException $e) {
            error_log("Error fetching passwords: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error fetching passwords'];
        }
    }

    function createPassword($conn, $data) {
        try {
            if (empty($data['title']) || empty($data['username']) || empty($data['password']) || empty($data['created_by'])) {
                return ['success' => false, 'message' => 'All fields are required'];
            }

            $stmt = $conn->prepare("INSERT INTO dashboard (title, username, password, created_by) VALUES (:title, :username, :password, :created_by)");
            $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
            $stmt->bindParam(':username', $data['username'], PDO::PARAM_STR);
            $stmt->bindParam(':password', $data['password'], PDO::PARAM_STR);
            $stmt->bindParam(':created_by', $data['created_by'], PDO::PARAM_STR);
            $stmt->execute();

            return [
                'success' => true, 
                'message' => 'Password created successfully', 
                'id' => $conn->lastInsertId()
            ];
        } catch (PDOException $e) {
            error_log("Error creating password: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error creating password'];
        }
    }

    function updatePassword($conn, $id, $data) {
        try {
            if (empty($data['title']) || empty($data['username']) || empty($data['password'])) {
                return ['success' => false, 'message' => 'All fields are required'];
            }

            $stmt = $conn->prepare("UPDATE dashboard SET title = :title, username = :username, password = :password WHERE id = :id");
            $stmt->bindParam(':title', $data['title'], PDO::PARAM_STR);
            $stmt->bindParam(':username', $data['username'], PDO::PARAM_STR);
            $stmt->bindParam(':password', $data['password'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return ['success' => true, 'message' => 'Password updated successfully'];
        } catch (PDOException $e) {
            error_log("Error updating password: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error updating password'];
        }
    }

    function deletePassword($conn, $id) {
        try {
            error_log("Attempting to delete password with ID: " . $id);
            $stmt = $conn->prepare("DELETE FROM dashboard WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                error_log("Password deleted successfully.");
                return ['success' => true, 'message' => 'Password deleted successfully'];
            } else {
                error_log("No password found with ID: " . $id);
                return ['success' => false, 'message' => 'No password found with the given ID'];
            }
        } catch (PDOException $e) {
            error_log("Error deleting password: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error deleting password'];
        }
    }

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $username = $_GET['username'] ?? null;
            if ($username) {
                echo json_encode(getPasswords($conn, $username));
            } else {
                echo json_encode(['success' => false, 'message' => 'Username not provided']);
            }
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (isset($input['title'], $input['username'], $input['password'], $input['created_by'])) {
                echo json_encode(createPassword($conn, $input));
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid data']);
            }
            break;

        case 'PUT':
            $input = json_decode(file_get_contents("php://input"), true);
            $id = $_GET['id'] ?? null;
            if ($id && isset($input['title'], $input['username'], $input['password'])) {
                echo json_encode(updatePassword($conn, $id, $input));
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid data for update']);
            }
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents("php://input"), true);
            $id = $input['id'] ?? null;
            if ($id) {
                echo json_encode(deletePassword($conn, $id));
            } else {
                echo json_encode(['success' => false, 'message' => 'ID not provided']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
    
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>