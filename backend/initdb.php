<?php
require_once 'database.php';

try {
    $conn = new mysqli("localhost", "root", "", "", 3306, "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock");

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    if (!$conn->set_charset("utf8mb4")) {
        throw new Exception("Failed to set character set: " . $conn->error);
    }

    $sql = "CREATE DATABASE IF NOT EXISTS safepass CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci";
    if (!$conn->query($sql)) {
        throw new Exception("Failed to create database: " . $conn->error);
    }

    $conn->select_db("safepass");

    function checkAndCreateOrUpdateTable($conn, $tableName, $createSQL, $expectedColumns) {
        $result = $conn->query("SHOW TABLES LIKE '$tableName'");
        if ($result->num_rows == 0) {
            if (!$conn->query($createSQL)) {
                throw new Exception("Failed to create table '$tableName': " . $conn->error);
            }
        } else {
            $result          = $conn->query("DESCRIBE $tableName");
            $existingColumns = [];
            while ($row = $result->fetch_assoc()) {
                $existingColumns[] = $row['Field'];
            }
            $missingColumns = array_diff($expectedColumns, $existingColumns);
            if (!empty($missingColumns)) {
                foreach ($missingColumns as $column) {
                    $alterSql = "ALTER TABLE $tableName ADD $column VARCHAR(255) NOT NULL";
                    if (!$conn->query($alterSql)) {
                        throw new Exception("Failed to add column '$column' to '$tableName': " . $conn->error);
                    }
                }
            }
        }
    }

    $createUsersTable = "
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL DEFAULT NULL,
        avatar_url VARCHAR(255) DEFAULT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci";

    $expectedUsersColumns = ['id', 'username', 'password', 'created_at', 'updated_at', 'last_login', 'avatar_url'];

    $createDashboardTable = "
    CREATE TABLE dashboard (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) DEFAULT NULL,
        username VARCHAR(100) DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by VARCHAR(255) DEFAULT NULL
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci";

    $expectedDashboardColumns = ['id', 'title', 'username', 'password', 'created_at', 'updated_at', 'created_by'];

    checkAndCreateOrUpdateTable($conn, 'users', $createUsersTable, $expectedUsersColumns);
    checkAndCreateOrUpdateTable($conn, 'dashboard', $createDashboardTable, $expectedDashboardColumns);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} finally {
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>