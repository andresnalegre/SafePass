<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'database.php';

const MESSAGES = [
    'userNotFound' => 'User was not found!',
    'fetchProfileError' => 'Error fetching profile',
    'fileTypeNotAllowed' => 'File type not allowed!',
    'fileTooLarge' => 'File is too large!',
    'uploadFailed' => 'Upload has failed!',
    'uploadError' => 'Upload error',
    'avatarRemoved' => 'Avatar removed successfully',
    'avatarNotFound' => 'Avatar not found',
    'removeAvatarError' => 'Error removing avatar',
    'passwordUpdated' => 'Password updated',
    'updatePasswordError' => 'Failed to update password',
    'userIdNotProvided' => 'User ID not provided',
    'invalidData' => 'Invalid data',
    'serverError' => 'Server error: '
];

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();

    function getUserProfile($conn, $userId) {
        try {
            $stmt = $conn->prepare("SELECT user, avatar_url FROM users WHERE id = :userId");
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                $user['avatarUrl'] = $user['avatar_url'] 
                    ? 'http://localhost:8000/' . $user['avatar_url'] 
                    : null;
                return ['success' => true, 'user' => $user];
            }
            
            return ['success' => false, 'message' => MESSAGES['userNotFound']];
        } catch (PDOException $e) {
            error_log("Error fetching profile: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['fetchProfileError']];
        }
    }

    function uploadAvatar($conn, $userId, $file) {
        try {
            $targetDir = "uploads/";
            
            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            $fileName = uniqid() . '-' . basename($file['name']);
            $targetFilePath = $targetDir . $fileName;
            $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

            $allowTypes = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array($fileType, $allowTypes)) {
                return ['success' => false, 'message' => MESSAGES['fileTypeNotAllowed']];
            }

            if ($file['size'] > 5 * 1024 * 1024) {
                return ['success' => false, 'message' => MESSAGES['fileTooLarge']];
            }

            if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
                $stmt = $conn->prepare("UPDATE users SET avatar_url = :avatarPath WHERE id = :userId");
                $stmt->bindParam(':avatarPath', $targetFilePath, PDO::PARAM_STR);
                $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                $stmt->execute();

                return [
                    'success' => true, 
                    'avatarUrl' => 'http://localhost:8000/' . $targetFilePath
                ];
            }

            return ['success' => false, 'message' => MESSAGES['uploadFailed']];
        } catch (PDOException $e) {
            error_log("Upload error: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['uploadError']];
        }
    }

    function removeAvatar($conn, $userId) {
        try {
            $stmt = $conn->prepare("SELECT avatar_url FROM users WHERE id = :userId");
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && $user['avatar_url']) {
                $filePath = $user['avatar_url'];

                if (file_exists($filePath)) {
                    unlink($filePath);
                }

                $stmt = $conn->prepare("UPDATE users SET avatar_url = NULL WHERE id = :userId");
                $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
                $stmt->execute();

                return ['success' => true, 'message' => MESSAGES['avatarRemoved']];
            }

            return ['success' => false, 'message' => MESSAGES['avatarNotFound']];
        } catch (PDOException $e) {
            error_log("Error removing avatar: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['removeAvatarError']];
        }
    }

    function updatePassword($conn, $userId, $newPassword) {
        try {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("UPDATE users SET password = :password WHERE id = :userId");
            $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            
            $stmt->execute();
            
            return ['success' => true, 'message' => MESSAGES['passwordUpdated']];
        } catch (PDOException $e) {
            error_log("Error updating password: " . $e->getMessage());
            return ['success' => false, 'message' => MESSAGES['updatePasswordError']];
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $userId = $_GET['user_id'] ?? null;
        if ($userId) {
            echo json_encode(getUserProfile($conn, $userId));
        } else {
            echo json_encode(['success' => false, 'message' => MESSAGES['userIdNotProvided']]);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['password']) && isset($input['user_id'])) {
            echo json_encode(updatePassword($conn, $input['user_id'], $input['password']));
        } elseif (isset($_FILES['avatar'])) {
            $userId = $_POST['user_id'] ?? null;
            if ($userId) {
                echo json_encode(uploadAvatar($conn, $userId, $_FILES['avatar']));
            } else {
                echo json_encode(['success' => false, 'message' => MESSAGES['userIdNotProvided']]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => MESSAGES['invalidData']]);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $userId = $_GET['user_id'] ?? null;
    
        if ($userId) {
            echo json_encode(removeAvatar($conn, $userId));
        } else {
            echo json_encode(['success' => false, 'message' => MESSAGES['userIdNotProvided']]);
        }
    }
    
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => MESSAGES['serverError'] . $e->getMessage()
    ]);
}
?>