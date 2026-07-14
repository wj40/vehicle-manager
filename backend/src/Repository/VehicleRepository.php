<?php
namespace Wjagusiak\VehicleManager\Repository;

use Wjagusiak\VehicleManager\Database\Database;
use Wjagusiak\VehicleManager\Factory\VehicleFactory;
use Wjagusiak\VehicleManager\Exception\VehicleNotFoundException;
use Wjagusiak\VehicleManager\Exception\VehicleWrongStatus;
use Wjagusiak\VehicleManager\Exception\VehicleWrongType;
use Wjagusiak\VehicleManager\Exception\VehicleInvalidReferenceException;
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
        $sql = "SELECT vehicles.*
                FROM vehicles
                JOIN brands ON vehicles.brand_id = brands.id ORDER BY vehicles.id";
        $statement = $this->pdo->prepare($sql);
        $statement->execute();

        $vehicles = [];
        $factory = new VehicleFactory;
        while($row = $statement->fetch(PDO::FETCH_ASSOC)){
            $vehicle = $factory->createObject($row['id'], $row['type'], $row['brand_id'], $row['model_id'], $row['reg_number'], $row['vin_number'], $row['production_year'], $row['status']);
            $vehicles[] = $vehicle->toArray();
        }
        return $vehicles;
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
            return $factory->createObject($row['id'], $row['type'], $row['brand_id'], $row['model_id'], $row['reg_number'], $row['vin_number'], $row['production_year'], $row['status']);
        }catch(\PDOException $e){
            throw new \RuntimeException("Blad bazy danych: " . $e->getMessage());
        }   
    }

    // wyszukuje wszystkie marki i zwraca alfabetycznie (bo uzytkownik bedzie widzial nazwy nie id)
    public function findAllBrands(): array{
        $sql = "SELECT * FROM brands ORDER BY name";
        $statement = $this->pdo->query($sql);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    // wyszukuje wszystkie modele danej marki i zwraca alfabetycznie
    public function findModelsByBrand(int $brandId): array{
        $sql = "SELECT id, name FROM models WHERE brand_id = ? ORDER BY name";
        $statement = $this->pdo->prepare($sql);
        $statement->execute([$brandId]);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    // rejestruje pojazd i zwraca tablice z obiektami - w tym przypadku nie jest do niczego sie nie przydaje
    public $vehicles = [];
    public function save(string $type, int $brandId, int $modelId, string $reg_number, string $vin_number, int $production_year, string $status){
        try{
            $types = ['car','truck','motorcycle','bus'];
            $statuses = ['available','rented','service'];
            if(!in_array($type, $types)){
                throw new VehicleWrongType;
            }
            if(!in_array($status, $statuses)){
                throw new VehicleWrongStatus;
            }
            $brand = $this->pdo->prepare("SELECT id FROM brands WHERE id = ?");
            $model = $this->pdo->prepare("SELECT id FROM models WHERE id = ?");
            $brand->execute([$brandId]);
            if(!$brand->fetch()) throw new VehicleInvalidReferenceException;
            $model->execute([$modelId]);
            if(!$model->fetch()) throw new VehicleInvalidReferenceException;
            // na gorze walidacja na dole wykonanie
            $sql = "INSERT INTO vehicles (type, brand_id, model_id, reg_number, vin_number, production_year, status) VALUES (?,?,?,?,?,?,?)";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$type, $brandId, $modelId, $reg_number, $vin_number, $production_year, $status]);

            $factory = new VehicleFactory();
            $this->vehicles[] = $factory->createObject($this->pdo->lastInsertId(), $type, $brandId, $modelId, $reg_number, $vin_number, $production_year, $status);
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
