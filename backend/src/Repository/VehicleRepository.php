<?php
namespace Wjagusiak\VehicleManager\Repository;

use Wjagusiak\VehicleManager\Database\Database;
use Wjagusiak\VehicleManager\Factory\VehicleFactory;
use Wjagusiak\VehicleManager\Exception\VehicleNotFoundException;
use Wjagusiak\VehicleManager\Exception\VehicleWrongStatus;
use Wjagusiak\VehicleManager\Exception\VehicleWrongType;
use PDO;
use Wjagusiak\VehicleManager\Entity\Vehicle;

class VehicleRepository{
    private PDO $pdo;
    public function __construct(){
        $db = new Database("localhost","root","vehicle_manager","");
        $this->pdo = $db->connect();
    }

    // zwraca wszystko jako tablice
    public function findAllAsArray(): array{
        $sql = "SELECT * FROM vehicles";
        $statement = $this->pdo->prepare($sql);
        $statement->execute();

        $vehicles = [];
        $factory = new VehicleFactory;
        while($row = $statement->fetch(PDO::FETCH_ASSOC)){
            $vehicle = $factory->createObject($row['id'], $row['type'], $row['brand'], $row['model'], $row['reg_number'], $row['vin_number'], $row['production_year'], $row['status']);
            $vehicles[] = $vehicle->toArray();
        }
        return $vehicles;
    }



    // wyswietla wszystko w tabeli i sortuje
    public function findAll(string $sortby){
        try{
            switch($sortby){
                case "type":
                    $sql = "SELECT * FROM vehicles ORDER BY type";
                    break;
                case "status":
                    $sql = "SELECT * FROM vehicles ORDER BY status";
                    break;
                case "brand":
                    $sql = "SELECT * FROM vehicles ORDER BY brand";
                    break;
                default:
                    $sql = "SELECT * FROM vehicles";
            }
            $statement = $this->pdo->prepare($sql);
            $statement->execute();
            while($row = $statement->fetch(PDO::FETCH_ASSOC)){
                echo "<tr>
                        <a id='v' value='".$row['id']."'><td>".$row['id']."</td></a>
                        <a id='v' value='".$row['id']."'><td>".$row['type']."</td></a>
                        <a id='v' value='".$row['id']."'><td>".$row['brand']."</td></a>
                        <a id='v' value='".$row['id']."'><td>".$row['model']."</td></a>
                        <a id='v' value='".$row['id']."'><td>".$row['reg_number']."</td></a>
                        <a id='v' value='".$row['id']."'><td>".$row['vin_number']."</td></a>
                        <a id='v' value='".$row['id']."'><td>".$row['production_year']."</td></a>
                        <a id='v' value='".$row['id']."'><td>".$row['status']."</td></a>
                    </tr>";
            };
        }catch(\PDOException $e){
            echo "Error: " . $e->getMessage();
        }

        
    }
    
    // wyswietla pojedyncze rekordy z obiektu tworzonego przez VehicleFactory. troche bez sensu ale zeby vehiclefactory chociaz cos robilo
    public function findById(int $id){
        try{
            $sql = "SELECT * FROM vehicles WHERE id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$id]);
            $row = $statement->fetch(PDO::FETCH_ASSOC);
            if ($row === false) {
                throw new VehicleNotFoundException($id);
            }
            $factory = new VehicleFactory;
            return $factory->createObject($row['id'], $row['type'], $row['brand'], $row['model'], $row['reg_number'], $row['vin_number'], $row['production_year'], $row['status']);
        }catch(\PDOException $e){
            throw new \RuntimeException("Blad bazy danych: " . $e->getMessage());
        }
        
    }

    // rejestruje pojazd i zwraca tablice z obiektami - w tym przypadku nie jest do niczego sie nie przydaje
    public $vehicles = [];
    public function save(string $type, string $brand, string $model, string $reg_number, string $vin_number, int $production_year, string $status){
        try{
            $types = ['car','truck','motorcycle','bus'];
            $statuses = ['available','rented','service'];
            if(!in_array($type, $types)){
                throw new VehicleWrongType;
            }
            if(!in_array($status, $statuses)){
                throw new VehicleWrongStatus;
            }
            $sql = "INSERT INTO vehicles (type, brand, model, reg_number, vin_number, production_year, status) VALUES (?,?,?,?,?,?,?)";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$type, $brand, $model, $reg_number, $vin_number, $production_year, $status]);

            $factory = new VehicleFactory();
            $this->vehicles[] = $factory->createObject($this->pdo->lastInsertId(), $type, $brand, $model, $reg_number, $vin_number, $production_year, $status);
            return $this->vehicles;
        }catch(\PDOException $e){
            echo "Error: " . $e->getMessage();
        }
    }
    
    // wszystko zwiazane z zmiana statusu (rent, return, service, finishservice). zmiana statusu w Vehicles i obsluga bledow jest po stronie VehicleService
    public function update(Vehicle $vehicle){
        try{
            $sql = "UPDATE vehicles SET status=? WHERE id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$vehicle->getStatus(), $vehicle->getId()]);
        }catch(\PDOException $e){
            echo "Error: " . $e->getMessage();
        }
    }
    
    // sprawdza czy jest i usuwa rekord, wywolywane z VehicleService bo juz chcialem zeby cala zakladka manage vehicles bylaS z VehicleService
    public function delete(int $id){
        $sql = "SELECT * FROM vehicles WHERE id=?";
        $statement = $this->pdo->prepare($sql);
        $statement->execute([$id]);
        $row = $statement->fetch(PDO::FETCH_ASSOC);
        if ($row === false) {
            throw new VehicleNotFoundException($id);
        }
        try{
            $sql = "DELETE FROM vehicles WHERE id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$id]);
        }catch(\PDOException $e){
            echo "Error: " . $e->getMessage();
        }
    }
    // wywolywana z VehicleService, zapisuje kazda zmiane do osobnej tabeli w baze, nie jest wyswietlane na stronie tylko w bazie
    public function vehicleHistory(int $id, string $action, string $oldStatus, string $newStatus){
        $sql = "INSERT INTO vehicle_history (vehicle_id, action, old_status, new_status) VALUES (?,?,?,?)";
        $statement = $this->pdo->prepare($sql);
        $statement->execute([$id, $action, $oldStatus, $newStatus]);
    }
    public function showVehicleHistory(int $id){
        try{
            $sql = "SELECT * FROM vehicle_history WHERE vehicle_id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$id]);
            return $statement->fetchAll(PDO::FETCH_ASSOC);
            }catch(\PDOException $e){
                throw new \RuntimeException("Blad bazy danych: " . $e->getMessage());
            }
    }
}

?>
