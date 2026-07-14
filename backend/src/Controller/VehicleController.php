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

    // GET /api/brands
    public function brands(): array{
        return $this->vehicleRepository->findAllBrands();
    }

    // GET /api/models/{brandId}
    public function models(int $brandId): array{
        return $this->vehicleRepository->findModelsByBrand($brandId);
    }

    // POST /api/vehicle
    public function store(array $data): array
    {
        $this->vehicleRepository->save(
            $data['type'] ?? '',
            $data['brand_id'] ?? 0,
            $data['model_id'] ?? 0,
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

    // POST /api/vehicle/{id}/edit
    public function edit(int $id, array $data): array
    {
        $current = $this->vehicleRepository->findById($id);
        $this->vehicleRepository->updateAllFields(
            $id,
            $data['type'] ?? $current->getVehicleType()->value,
            (int)($data['brand_id'] ?? $current->getBrandId()),
            (int)($data['model_id'] ?? $current->getModelId()),
            $data['reg_number'] ?? $current->getRegNumber(),
            $data['vin_number'] ?? $current->getVinNumber(),
            (int)($data['productionYear'] ?? $current->getProductionYear())
        );
        return ['message' => 'Vehicle updated'];
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

    public function storeBrand(string $name){
        $this->vehicleRepository->addBrand($name);
        return ['message' => 'Brand added'];
    }

    public function updateBrand(int $id, string $name){
        $this->vehicleRepository->updateBrand($id, $name);
        return ['message' => 'Brand changed'];
    }

    public function destroyBrand(int $id){
        $this->vehicleRepository->deleteBrand($id);
        return ['message' => 'Brand removed'];
    }

    public function destroyModel(int $id){
        $this->vehicleRepository->deleteModel($id);
        return ['message' => 'Model removed'];
    }

    public function updateModel(int $id, string $name){
        $this->vehicleRepository->updateModel($id, $name);
        return ['message' => 'Model changed'];
    }

    public function storeModel(array $data){
        $this->vehicleRepository->addModel((int)$data['brand_id'], $data['name']);
        return ['message' => 'Model added'];
    }
}