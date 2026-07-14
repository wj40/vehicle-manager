<?php
namespace Wjagusiak\VehicleManager\Factory;

use Wjagusiak\VehicleManager\Entity\Vehicle;
use Wjagusiak\VehicleManager\Enum\VehicleType;


class VehicleFactory{
    public function createObject(int $id, string $type, int $brandId, int $modelId, string $reg_number, string $vin_number, int $production_year, string $status){

        $vehicle = new Vehicle();
        $vehicle->setId($id);
        $vehicle->setVehicleType(VehicleType::from($type));
        $vehicle->setBrandId($brandId);
        $vehicle->setModelId($modelId);
        $vehicle->setRegNumber($reg_number);
        $vehicle->setVinNumber($vin_number);
        $vehicle->setProductionYear($production_year);
        $vehicle->setStatus($status);

        return $vehicle;
    } 
}
?>