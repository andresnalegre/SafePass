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

const MESSAGES = [
    'passwordsFound' => 'Passwords found.',
    'noPasswordsFound' => 'No passwords found.',
    'fetchPasswordsError' => 'Error fetching passwords.',
    'allFieldsRequired' => 'All fields are required.',
    'passwordCreated' => 'Password created.',
    'createPasswordError' => 'Error creating password.',
    'passwordUpdated' => 'Password updated.',
    'updatePasswordError' => 'Error updating password.',
    'passwordDeleted' => 'Password deleted.',
    'noPasswordFound' => 'No password found with the given ID.',
    'deletePasswordError' => 'Error deleting password.',
    'usernameNotProvided' => 'Username not provided.',
    'invalidData' => 'Invalid data.',
    'invalidDataForUpdate' => 'Invalid data for update.',
    'idNotProvided' => 'ID not provided.',
    'methodNotAllowed' => 'Method not allowed.',
    'serverError' => 'Server error.'
];

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();

    function getPasswords($conn, $username) {
        try {
            // Atualiza o last_login para o timestamp atual
            $stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE username = ?");
            $stmt->bind_param("s", $username);
            if (!$stmt->execute()) {
                throw new Exception("Failed to update last_login for user: $username");
            }

            $stmt = $conn->prepare("SELECT id, title, username, password FROM dashboard WHERE created_by = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $passwords = $result->fetch_all(MYSQLI_ASSOC);
            
            return ['success' => true, 'passwords' => $passwords ?: [], 'message' => $passwords ? MESSAGES['passwordsFound'] : MESSAGES['noPasswordsFound']];
        } catch (Exception $e) {
            error_log("Error fetching passwords: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['fetchPasswordsError']];
        }
    }

    function createPassword($conn, $data) {
        try {
            if (empty($data['title']) || empty($data['username']) || empty($data['password']) || empty($data['created_by'])) {
                return ['success' => false, 'message' => MESSAGES['allFieldsRequired']];
            }

            $stmt = $conn->prepare("INSERT INTO dashboard (title, username, password, created_by) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $data['title'], $data['username'], $data['password'], $data['created_by']);
            if ($stmt->execute()) {
                return [
                    'success' => true, 
                    'message' => MESSAGES['passwordCreated'], 
                    'id' => $conn->insert_id
                ];
            } else {
                return ['success' => false, 'message' => MESSAGES['createPasswordError']];
            }
        } catch (Exception $e) {
            error_log("Error creating password: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['createPasswordError']];
        }
    }

    function updatePassword($conn, $id, $data) {
        try {
            if (empty($data['title']) || empty($data['username']) || empty($data['password'])) {
                return ['success' => false, 'message' => MESSAGES['allFieldsRequired']];
            }

            $stmt = $conn->prepare("UPDATE dashboard SET title = ?, username = ?, password = ? WHERE id = ?");
            $stmt->bind_param("sssi", $data['title'], $data['username'], $data['password'], $id);
            if ($stmt->execute()) {
                return ['success' => true, 'message' => MESSAGES['passwordUpdated']];
            } else {
                return ['success' => false, 'message' => MESSAGES['updatePasswordError']];
            }
        } catch (Exception $e) {
            error_log("Error updating password: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['updatePasswordError']];
        }
    }

    function deletePassword($conn, $id) {
        try {
            $stmt = $conn->prepare("DELETE FROM dashboard WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                return ['success' => true, 'message' => MESSAGES['passwordDeleted']];
            } else {
                return ['success' => false, 'message' => MESSAGES['noPasswordFound']];
            }
        } catch (Exception $e) {
            error_log("Error deleting password: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['deletePasswordError']];
        }
    }

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $username = $_GET['username'] ?? null;
            if ($username) {
                echo json_encode(getPasswords($conn, $username));
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['usernameNotProvided']]);
            }
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (isset($input['title'], $input['username'], $input['password'], $input['created_by'])) {
                echo json_encode(createPassword($conn, $input));
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['invalidData']]);
            }
            break;

        case 'PUT':
            $input = json_decode(file_get_contents("php://input"), true);
            $id = $_GET['id'] ?? null;
            if ($id && isset($input['title'], $input['username'], $input['password'])) {
                echo json_encode(updatePassword($conn, $id, $input));
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['invalidDataForUpdate']]);
            }
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents("php://input"), true);
            $id = $input['id'] ?? null;
            if ($id) {
                echo json_encode(deletePassword($conn, $id));
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['idNotProvided']]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => MESSAGES['methodNotAllowed']]);
            break;
    }
    
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => MESSAGES['serverError']
    ]);
}
?>