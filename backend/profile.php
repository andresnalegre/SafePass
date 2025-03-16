<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'database.php'; // Include your database connection file

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();

    function getUserProfile($conn, $userId) {
        try {
            // Use o nome correto do campo do banco de dados
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
            
            return ['success' => false, 'message' => 'Usuário não encontrado'];
        } catch (PDOException $e) {
            error_log("Erro ao buscar perfil: " . $e->getMessage());
            return ['success' => false, 'message' => 'Erro ao buscar perfil'];
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
                return ['success' => false, 'message' => 'Tipo de arquivo não permitido'];
            }

            if ($file['size'] > 5 * 1024 * 1024) {
                return ['success' => false, 'message' => 'Arquivo muito grande'];
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

            return ['success' => false, 'message' => 'Falha no upload'];
        } catch (PDOException $e) {
            error_log("Erro no upload: " . $e->getMessage());
            return ['success' => false, 'message' => 'Erro no upload'];
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

                return ['success' => true, 'message' => 'Avatar removido com sucesso'];
            }

            return ['success' => false, 'message' => 'Avatar não encontrado'];
        } catch (PDOException $e) {
            error_log("Erro ao remover avatar: " . $e->getMessage());
            return ['success' => false, 'message' => 'Erro ao remover avatar'];
        }
    }

    function updatePassword($conn, $userId, $newPassword) {
        try {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("UPDATE users SET password = :password WHERE id = :userId");
            $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
            
            $stmt->execute();
            
            return ['success' => true, 'message' => 'Senha atualizada'];
        } catch (PDOException $e) {
            error_log("Erro ao atualizar senha: " . $e->getMessage());
            return ['success' => false, 'message' => 'Falha ao atualizar senha'];
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $userId = $_GET['user_id'] ?? null;
        if ($userId) {
            echo json_encode(getUserProfile($conn, $userId));
        } else {
            echo json_encode(['success' => false, 'message' => 'ID do usuário não fornecido']);
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
                echo json_encode(['success' => false, 'message' => 'ID do usuário não fornecido']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $userId = $_GET['user_id'] ?? null;
    
        if ($userId) {
            echo json_encode(removeAvatar($conn, $userId));
        } else {
            echo json_encode(['success' => false, 'message' => 'ID do usuário não fornecido']);
        }
    }
    
} catch (Exception $e) {
    error_log("Erro geral: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}