<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'database.php';

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
            
            return ['success' => false, 'message' => 'User not found'];
        } catch (PDOException $e) {
            error_log("Error fetching profile: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error fetching profile'];
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
                return ['success' => false, 'message' => 'File type not allowed'];
            }

            if ($file['size'] > 5 * 1024 * 1024) {
                return ['success' => false, 'message' => 'File too large'];
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

            return ['success' => false, 'message' => 'Upload failed'];
        } catch (PDOException $e) {
            error_log("Upload error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Upload error'];
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

                return ['success' => true, 'message' => 'Avatar removed successfully'];
            }

            return ['success' => false, 'message' => 'Avatar not found'];
        } catch (PDOException $e) {
            error_log("Error removing avatar: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error removing avatar'];
        }
    }

    function updatePassword($conn, $userId, $newPassword) {
        try {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("UPDATE users SET password = :password WHERE id = :userId");
            $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            
            $stmt->execute();
            
            return ['success' => true, 'message' => 'Password updated'];
        } catch (PDOException $e) {
            error_log("Error updating password: " . $e->getMessage());
            return ['success' => false, 'message' => 'Failed to update password'];
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $userId = $_GET['user_id'] ?? null;
        if ($userId) {
            echo json_encode(getUserProfile($conn, $userId));
        } else {
            echo json_encode(['success' => false, 'message' => 'User ID not provided']);
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
                echo json_encode(['success' => false, 'message' => 'User ID not provided']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid data']);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $userId = $_GET['user_id'] ?? null;
    
        if ($userId) {
            echo json_encode(removeAvatar($conn, $userId));
        } else {
            echo json_encode(['success' => false, 'message' => 'User ID not provided']);
        }
    }
    
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>