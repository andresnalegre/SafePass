<?php

class Database {
    private $host;
    private $dbName;
    private $username;
    private $password;
    private $connection;
    private static $instance;

    private function __construct() {
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->dbName = getenv('DB_NAME') ?: 'safepass';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') ?: 'admin';
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        if ($this->connection === null) {
            try {
                // Conectar sem especificar o banco de dados
                $dsn = "mysql:host={$this->host};charset=utf8mb4";
                $this->connection = new PDO($dsn, $this->username, $this->password);
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                $this->connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

                // Criar o banco de dados se não existir
                $this->connection->exec("CREATE DATABASE IF NOT EXISTS {$this->dbName}");

                // Agora, conectar ao banco de dados específico
                $dsnWithDb = "mysql:host={$this->host};dbname={$this->dbName};charset=utf8mb4";
                $this->connection = new PDO($dsnWithDb, $this->username, $this->password);
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                $this->connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

            } catch (PDOException $e) {
                error_log("Database connection error: " . $e->getMessage());
                throw new Exception("Database connection error.");
            }
        }
        return $this->connection;
    }

    public function getDatabaseName() {
        return $this->dbName;
    }

    public function closeConnection() {
        $this->connection = null;
    }
}
?>