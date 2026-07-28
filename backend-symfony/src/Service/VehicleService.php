<?php

namespace App\Service;

use App\Entity\Vehicle;
use App\Entity\VehicleHistory;
use App\Enum\VehicleStatus;
use App\Repository\VehicleHistoryRepository;
use App\Repository\VehicleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Attribute\Route;

class VehicleService{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private VehicleRepository $vehicleRepository,
        private VehicleHistoryRepository $historyRepository
    ){}

    private function logHistory(Vehicle $vehicle, string $action, string $newStatus): void{
        $history = new VehicleHistory();
        $history->setVehicle($vehicle);
        $history->setAction($action);
        $history->setOldStatus($vehicle->getStatus()->value);
        $history->setNewStatus($newStatus);
        $history->setChangedAt(new \DateTimeImmutable());

        $this->entityManager->persist($history);
    }

    public function rentVehicle(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status === VehicleStatus::Rented){
            throw new \Exception('Vehicle is already rented');
        }
        if($status === VehicleStatus::Service){
            throw new \Exception('Vehicle is in service');
        }
        $this->logHistory($vehicle, 'rent', 'rented');
        $vehicle->setStatus(VehicleStatus::Rented);
        $this->entityManager->flush();
    }
    
    public function returnVehicle(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status != VehicleStatus::Rented){
            throw new \Exception('Vehicle is not rented');
        }
        $this->logHistory($vehicle, 'return', 'available');
        $vehicle->setStatus(VehicleStatus::Available);
        $this->entityManager->flush();
    }

    public function sendVehicleToService(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status === VehicleStatus::Service){
            throw new \Exception('Vehicle is already serviced');
        }
        $this->logHistory($vehicle, 'service', 'service');
        $vehicle->setStatus(VehicleStatus::Service);
        $this->entityManager->flush();
    }

    public function finishVehicleService(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status != VehicleStatus::Service){
            throw new \Exception('Vehicle is not in service');
        }
        $this->logHistory($vehicle, 'finishService', 'available');
        $vehicle->setStatus(VehicleStatus::Available);
        $this->entityManager->flush();
    }

    public function removeVehicle(Vehicle $vehicle): void{
        $this->logHistory($vehicle, 'delete', $vehicle->getStatus()?->value);
        $this->entityManager->remove($vehicle);
        $this->entityManager->flush();
    }
}