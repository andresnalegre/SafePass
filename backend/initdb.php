<?php

require_once 'database.php';

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    $dbName = $db->getDatabaseName();
    $stmt = $conn->query("SHOW DATABASES LIKE '$dbName'");
    if ($stmt->rowCount() == 0) {
        $conn->exec("CREATE DATABASE $dbName");
        echo "Database '$dbName' created.\n";
    }

    $conn->exec("USE $dbName");

    function checkAndCreateTable($conn, $tableName, $createSQL, $expectedColumns) {
        $stmt = $conn->query("SHOW TABLES LIKE '$tableName'");
        if ($stmt->rowCount() == 0) {
            $conn->exec($createSQL);
            echo "Table '$tableName' created.\n";
        } else {
            $stmt = $conn->query("DESCRIBE $tableName");
            $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
            if (array_diff($expectedColumns, $columns)) {
                $conn->exec("DROP TABLE $tableName");
                $conn->exec($createSQL);
                echo "Table '$tableName' structure corrected.\n";
            }
        }
    }

    $createUsersTable = "
    CREATE TABLE users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL DEFAULT NULL,
        avatar_url VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (id)
    );";

    $expectedUsersColumns = ['id', 'user', 'password', 'created_at', 'updated_at', 'last_login', 'avatar_url'];

    $createDashboardTable = "
    CREATE TABLE dashboard (
        id INT(11) NOT NULL AUTO_INCREMENT,
        title VARCHAR(100) DEFAULT NULL,
        username VARCHAR(100) DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (id)
    );";

    $expectedDashboardColumns = ['id', 'title', 'username', 'password', 'created_at', 'updated_at', 'created_by'];

    checkAndCreateTable($conn, 'users', $createUsersTable, $expectedUsersColumns);
    checkAndCreateTable($conn, 'dashboard', $createDashboardTable, $expectedDashboardColumns);

    echo "Database is OK!\n";

} catch (Exception $e) {
    echo "An error occurred: " . $e->getMessage();
}
?>