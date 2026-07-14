<?php
namespace Wjagusiak\VehicleManager\Factory;

use Wjagusiak\VehicleManager\Entity\Vehicle;
use Wjagusiak\VehicleManager\Enum\VehicleType;


class VehicleFactory{
    
    // wywolywane z VehicleRepository z funkcji save i zwraca obiekt zapisywany do tablicy $vehicles ale z save ta tablica nie jest juz nigdzie wykorzystywana
    // wywolywane z VehicleRepository z funkcji findById, zwraca obiekt i funkcja findById zwraca obiekt do index.php ktory wyswietla juz na stronie
    public function createObject(int $id, string $type, string $brand, string $model, string $reg_number, string $vin_number, int $production_year, string $status){

        $vehicle = new Vehicle();
        $vehicle->setId($id);
        $vehicle->setVehicleType(VehicleType::from($type));
        $vehicle->setBrand($brand);
        $vehicle->setModel($model);
        $vehicle->setRegNumber($reg_number);
        $vehicle->setVinNumber($vin_number);
        $vehicle->setProductionYear($production_year);
        $vehicle->setStatus($status);

        return $vehicle;
    } 
}
?>