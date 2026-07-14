<?php
namespace Wjagusiak\VehicleManager\Service;

use Wjagusiak\VehicleManager\Entity\Vehicle;
use Wjagusiak\VehicleManager\Exception\VehicleAlreadyRentedException;
use Wjagusiak\VehicleManager\Exception\VehicleAvailableException;
use Wjagusiak\VehicleManager\Exception\VehicleInServiceException;
use Wjagusiak\VehicleManager\Repository\VehicleRepository;

class VehicleService{
    private VehicleRepository $system;

    public function __construct(){
        $this->system = new VehicleRepository;
    }

// obsluga calej zakladki manage vehicles z index.php, obsluga bledow i wywolywanie vehicleHistory

    public function rentVehicle(Vehicle $vehicle){
        $status = $vehicle->getStatus();
        if($status === 'rented'){
            throw new VehicleAlreadyRentedException($vehicle->getId());
        }
        if($status === 'service'){
            throw new VehicleInServiceException($vehicle->getId());
        }
        $this->system->vehicleHistory($vehicle->getId(), "rent", $status, "rented");
        $vehicle->changeStatus("rented");
    }
    public function returnVehicle(Vehicle $vehicle){
        $status = $vehicle->getStatus();
        if($status === 'service'){
            throw new VehicleInServiceException($vehicle->getId());
        }
        if($status === 'available'){
            throw new VehicleAvailableException($vehicle->getId());
        }
        $this->system->vehicleHistory($vehicle->getId(), "return", $status, "available");
        $vehicle->changeStatus("available");
    }
    public function sendVehicleToService(Vehicle $vehicle){
        $status = $vehicle->getStatus();
        if($status === 'service'){
            throw new VehicleInServiceException($vehicle->getId());
        }
        $this->system->vehicleHistory($vehicle->getId(), "service", $status, "service");
        $vehicle->changeStatus("service");

        return $vehicle;
    }
    public function finishVehicleService(Vehicle $vehicle){
        $status = $vehicle->getStatus();
        $vehicle->changeStatus("available");
        $this->system->vehicleHistory($vehicle->getId(), "finishService", $status, "available");
    }

    // tutaj bym mogl do vehiclehistory i delete wyslac caly obiekt vehicle tak jak np changestatus wysyla caly obiekt do update tylko ze tutaj i tak operuje na samym id
    // w przeciwienstwie do update gdzie uzywam id i status wiec lepiej juz tutaj uzyc gettera a tam wyslac zmienna i nie robic getterow kilka razy
    public function removeVehicle(Vehicle $vehicle){
        $status = $vehicle->getStatus();
        $this->system->vehicleHistory($vehicle->getId(), "delete", $status, "deleted");
        $this->system->delete($vehicle->getId());
    }
}
?>