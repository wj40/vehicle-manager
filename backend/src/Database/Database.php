<?php
namespace Wjagusiak\VehicleManager\Database;
use PDO;
use PDOException;

class Database{
    private PDO $conn;

    function __construct(string $host, string $user, string $name, ?string $password = null)
    {
        try{
            $this->conn = new PDO("mysql:host=$host;dbname=$name", $user, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }catch(PDOException $e){
            die("blad. " . $e->getMessage());
        }
    }
    function connect(){
        return $this->conn;
    }
}
?>