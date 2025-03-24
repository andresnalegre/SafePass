<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

const MESSAGES = [
    'logoutSuccess' => 'See you next time!',
    'logoutError' => 'Error during logout',
    'invalidRequestMethod' => 'Invalid request method'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $_SESSION = [];

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        session_destroy();

        echo json_encode(['success' => true, 'message' => MESSAGES['logoutSuccess']]);
    } catch (Exception $e) {
        error_log("Logout error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => MESSAGES['logoutError']]);
    }
} else {
    echo json_encode(['success' => false, 'message' => MESSAGES['invalidRequestMethod']]);
}
?>