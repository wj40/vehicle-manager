<?php
namespace Wjagusiak\VehicleManager\Repository;

use Wjagusiak\VehicleManager\Database\Database;
use Wjagusiak\VehicleManager\Factory\VehicleFactory;
use Wjagusiak\VehicleManager\Exception\VehicleNotFoundException;
use Wjagusiak\VehicleManager\Exception\VehicleWrongStatus;
use Wjagusiak\VehicleManager\Exception\VehicleWrongType;
use Wjagusiak\VehicleManager\Exception\VehicleInvalidReferenceException;
use Wjagusiak\VehicleManager\Exception\VehicleAlreadyExistException;
use PDO;
use Wjagusiak\VehicleManager\Entity\Vehicle;
use Wjagusiak\VehicleManager\Exception\BrandInUseException;

class VehicleRepository{
    private PDO $pdo;
    public function __construct(){
        $db = new Database("localhost","root","vehicle_manager","");
        $this->pdo = $db->connect();
    }

    // logowanie
    public function findUserByLogin(string $login): ?array{
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE login = ?");
        $stmt->execute([$login]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
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
            // walidacja reg i vin
            $reg = $this->pdo->prepare("SELECT id FROM vehicles WHERE reg_number=?");
            $reg->execute([$reg_number]);
            if($reg->fetch()) throw new VehicleAlreadyExistException("Vehicle");

            $vin = $this->pdo->prepare("SELECT id FROM vehicles WHERE vin_number=?");
            $vin->execute([$vin_number]);
            if($vin->fetch()) throw new VehicleAlreadyExistException("Vehicle");
            // walidacja statusu i typu
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
    
    public function updateAllFields(int $id, string $type, int $brandId, int $modelId, string $regNumber, string $vinNumber, int $productionYear): void
    {
        $reg = $this->pdo->prepare("SELECT id FROM vehicles WHERE reg_number=? AND id!=?");
        $reg->execute([$regNumber, $id]);
        if($reg->fetch()) throw new VehicleAlreadyExistException("Vehicle");

        $vin = $this->pdo->prepare("SELECT id FROM vehicles WHERE vin_number=? AND id!=?");
        $vin->execute([$vinNumber, $id]);
        if($vin->fetch()) throw new VehicleAlreadyExistException("Vehicle");

        $types = ['car','truck','motorcycle','bus'];
        if (!in_array($type, $types)) throw new VehicleWrongType;

        $brand = $this->pdo->prepare("SELECT id FROM brands WHERE id = ?");
        $model = $this->pdo->prepare("SELECT id FROM models WHERE id = ?");
        $brand->execute([$brandId]);
        if (!$brand->fetch()) throw new VehicleInvalidReferenceException;
        $model->execute([$modelId]);
        if (!$model->fetch()) throw new VehicleInvalidReferenceException;

        $sql = "UPDATE vehicles SET type=?, brand_id=?, model_id=?, reg_number=?, vin_number=?, production_year=? WHERE id=?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$type, $brandId, $modelId, $regNumber, $vinNumber, $productionYear, $id]);
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

    // ZMIANA MAREK I MODELI

    public function addBrand(string $name): void{
        try{
            $brand = $this->pdo->prepare("SELECT id FROM brands WHERE name=?");
            $brand->execute([$name]);
            if($brand->fetch()) throw new VehicleAlreadyExistException("Brand");

            $sql = "INSERT INTO brands (name) VALUES (?)";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$name]);
        }catch(\PDOException $e){
            throw new \RuntimeException("Error: " . $e->getMessage());
        }
    }

    public function updateBrand(int $id, string $name): void{
        try{
            $sql = "UPDATE brands SET name=? WHERE id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$name, $id]);
        }catch(\PDOException $e){
            throw new \RuntimeException("Error: " . $e->getMessage());
        }
    }

    public function deleteBrand(int $id): void{
        try{
            $brand = $this->pdo->prepare("SELECT id FROM vehicles WHERE brand_id=?");
            $brand->execute([$id]);
            if($brand->fetch()) throw new BrandInUseException("Brand");

            $sql = "DELETE FROM brands WHERE id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$id]);
        }catch(\PDOException $e){
            throw new \RuntimeException("Error: " . $e->getMessage());
        }
    }

    public function deleteModel(int $id): void{
        try{
            $model = $this->pdo->prepare("SELECT id FROM vehicles WHERE model_id=?");
            $model->execute([$id]);
            if($model->fetch()) throw new BrandInUseException("Model");

            $sql = "DELETE FROM models WHERE id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$id]);
        }catch(\PDOException $e){
            throw new \RuntimeException("Error: " . $e->getMessage());
        }
    }

    public function updateModel(int $id, string $name): void{
        try{
            $sql = "UPDATE models SET name=? WHERE id=?";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$name, $id]);
        }catch(\PDOException $e){
            throw new \RuntimeException("Error: " . $e->getMessage());
        }
    }

    public function addModel(int $brand_id, string $name): void{
        try{
            $model = $this->pdo->prepare("SELECT id FROM models WHERE brand_id=? AND name=?");
            $model->execute([$brand_id, $name]);
            if($model->fetch()) throw new VehicleAlreadyExistException("Brand");

            $sql = "INSERT INTO models (brand_id, name) VALUES (?,?)";
            $statement = $this->pdo->prepare($sql);
            $statement->execute([$brand_id, $name]);
        }catch(\PDOException $e){
            throw new \RuntimeException("Error: " . $e->getMessage());
        }
    }
}

?>
