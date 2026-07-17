<?php

namespace App\Service;

use App\Entity\Vehicle;
use App\Entity\VehicleHistory;
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
        $history->setOldStatus($vehicle->getStatus());
        $history->setNewStatus($newStatus);
        $history->setChangedAt(new \DateTimeImmutable());

        $this->entityManager->persist($history);
    }

    public function rentVehicle(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status === 'rented'){
            throw new \Exception('Vehicle is already rented');
        }
        if($status === 'service'){
            throw new \Exception('Vehicle is in service');
        }
        $this->logHistory($vehicle, 'rent', 'rented');
        $vehicle->setStatus('rented');
        $this->entityManager->flush();
    }
    
    public function returnVehicle(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status != 'rented'){
            throw new \Exception('Vehicle is not rented');
        }
        $this->logHistory($vehicle, 'return', 'available');
        $vehicle->setStatus('available');
        $this->entityManager->flush();
    }

    public function sendVehicleToService(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status === 'service'){
            throw new \Exception('Vehicle is already serviced');
        }
        $this->logHistory($vehicle, 'service', 'service');
        $vehicle->setStatus('service');
        $this->entityManager->flush();
    }

    public function finishVehicleService(Vehicle $vehicle): void{
        $status = $vehicle->getStatus();
        if($status != 'service'){
            throw new \Exception('Vehicle is not in service');
        }
        $this->logHistory($vehicle, 'finishService', 'available');
        $vehicle->setStatus('available');
        $this->entityManager->flush();
    }

    public function removeVehicle(Vehicle $vehicle): void{
        $this->logHistory($vehicle, 'delete', $vehicle->getStatus());
        $this->entityManager->remove($vehicle);
        $this->entityManager->flush();
    }
}