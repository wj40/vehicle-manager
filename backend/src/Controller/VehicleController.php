<?php
namespace Wjagusiak\VehicleManager\Controller;

use Wjagusiak\VehicleManager\Service\VehicleService;
use Wjagusiak\VehicleManager\Repository\VehicleRepository;

final class VehicleController
{
    private VehicleService $vehicleService;
    private VehicleRepository $vehicleRepository;

    public function __construct()
    {
        $this->vehicleService = new VehicleService();
        $this->vehicleRepository = new VehicleRepository();
    }

    // GET /api/vehicle
    // find all
    public function index(): array
    {
        return $this->vehicleRepository->findAllAsArray();
    }

    // GET /api/vehicle/{id}
    // find by id
    public function show(int $id): array
    {
        $vehicle = $this->vehicleRepository->findById($id);
        return $vehicle->toArray();
    }

    // POST /api/vehicle
    public function store(array $data): array
    {
        $this->vehicleRepository->save(
            $data['type'] ?? '',
            $data['brand'] ?? '',
            $data['model'] ?? '',
            $data['reg_number'] ?? '',
            $data['vin_number'] ?? '',
            (int)($data['productionYear'] ?? 0),
            $data['status'] ?? ''
        );
        return ['message' => 'Vehicle registered'];
    }

    // POST /api/vehicle/{id}/rent
    public function rent(int $id): array
    {
        $vehicle = $this->vehicleRepository->findById($id);
        $this->vehicleService->rentVehicle($vehicle);
        return $vehicle->toArray();
    }

    // POST /api/vehicle/{id}/return
    public function returnVehicle(int $id): array
    {
        $vehicle = $this->vehicleRepository->findById($id);
        $this->vehicleService->returnVehicle($vehicle);
        return $vehicle->toArray();
    }

    // POST /api/vehicle/{id}/service
    public function sendToService(int $id): array
    {
        $vehicle = $this->vehicleRepository->findById($id);
        $this->vehicleService->sendVehicleToService($vehicle);
        return $vehicle->toArray();
    }

    // POST /api/vehicle/{id}/finish-service
    public function finishService(int $id): array
    {
        $vehicle = $this->vehicleRepository->findById($id);
        $this->vehicleService->finishVehicleService($vehicle);
        return $vehicle->toArray();
    }

    // DELETE /api/vehicle/{id}
    public function destroy(int $id): array
    {
        $vehicle = $this->vehicleRepository->findById($id);
        $this->vehicleService->removeVehicle($vehicle);
        return ['message' => 'Vehicle deleted'];
    }

    public function history(int $id): array
    {
        return $this->vehicleRepository->showVehicleHistory($id);
    }
}