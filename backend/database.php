<?php

class Database {
    private $host;
    private $dbName;
    private $username;
    private $password;
    private $socket;
    private $connection;
    private static $instance;

    const MESSAGES = [
        'connectionError' => "Failed to connect to the database.",
        'charsetError' => "Failed to set character set to utf8mb4."
    ];

    private function __construct() {
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->dbName = getenv('DB_NAME') ?: 'safepass';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') ?: '';
        $this->socket = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        if ($this->connection === null) {
            $this->connection = new mysqli($this->host, $this->username, $this->password, $this->dbName, 0, $this->socket);

            if ($this->connection->connect_error) {
                error_log("Database connection error: " . $this->connection->connect_error);
                throw new Exception(self::MESSAGES['connectionError'] . " " . $this->connection->connect_error);
            }

            if (!$this->connection->set_charset("utf8mb4")) {
                throw new Exception(self::MESSAGES['charsetError'] . " " . $this->connection->error);
            }
        }
        return $this->connection;
    }

    public function closeConnection() {
        if ($this->connection !== null) {
            $this->connection->close();
            $this->connection = null;
        }
    }
}
?>