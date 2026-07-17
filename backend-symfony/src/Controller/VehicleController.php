<?php

namespace App\Controller;

use App\Repository\BrandRepository;
use App\Repository\VehicleModelRepository;
use App\Repository\VehicleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Vehicle;
use App\Entity\VehicleHistory;
use App\Repository\VehicleHistoryRepository;
use App\Service\VehicleService;

final class VehicleController extends AbstractController
{
    #[Route('/api/brands', methods: ['GET'])]
    public function brands(BrandRepository $repository): JsonResponse{
        return $this->json($repository->findAll());
    }

    #[Route('/api/models/{brandId}', methods: ['GET'])]
    public function models(int $brandId, VehicleModelRepository $repository): JsonResponse{
        return $this->json($repository->findBy(['brand' => $brandId]));
    }

    #[Route('/api/vehicle', methods: ['GET'])]
    public function index(VehicleRepository $repository): JsonResponse{
        return $this->json($repository->findAll());
    }

    #[Route('/api/vehicle/{id}', methods: ['GET'])]
    public function show(int $id, VehicleRepository $repository): JsonResponse{
        return $this->json($repository->find($id));
    }

    #[Route('/api/vehicle', methods: ['POST'])]
    public function store(
        Request $request,
        EntityManagerInterface $entityManager,
        BrandRepository $brandRepository,
        VehicleModelRepository $modelRepository,
    ): JsonResponse{
        $data = json_decode($request->getContent(), true);

        $vehicle = new Vehicle();
        $vehicle->setType($data['type']);
        $vehicle->setRegNumber($data['reg_number'] ?? null);
        $vehicle->setVinNumber($data['vin_number'] ?? null);
        $vehicle->setProductionYear($data['productionYear']);
        $vehicle->setStatus($data['status'] ?? 'available');
        $vehicle->setCreatedAt(new \DateTimeImmutable());

        $brand = $brandRepository->find($data['brand_id']);
        $model = $modelRepository->find($data['model_id']);

        $vehicle->setBrand($brand);
        $vehicle->setModel($model);

        $entityManager->persist($vehicle);
        $entityManager->flush();

        return $this->json($vehicle, 201);
    }

    #[Route('/api/vehicle/{id}/rent', methods: 'POST')]
    public function rent(
        int $id, 
        VehicleRepository $repository, 
        VehicleService $service): JsonResponse{

        $vehicle = $repository->find($id);
        $service->rentVehicle($vehicle);
        return $this->json($vehicle);
    }

    #[Route('/api/vehicle/{id}/return', methods: 'POST')]
    public function returnVehicle(
        int $id, 
        VehicleRepository $repository, 
        VehicleService $service): JsonResponse{

        $vehicle = $repository->find($id);
        $service->returnVehicle($vehicle);
        return $this->json($vehicle);
    }

    #[Route('/api/vehicle/{id}/service', methods: 'POST')]
    public function sendToService(
        int $id, 
        VehicleRepository $repository, 
        VehicleService $service): JsonResponse{

        $vehicle = $repository->find($id);
        $service->sendVehicleToService($vehicle);
        return $this->json($vehicle);
    }

    #[Route('/api/vehicle/{id}/finish-service', methods: 'POST')]
    public function finishService(
        int $id, 
        VehicleRepository $repository, 
        VehicleService $service): JsonResponse{

        $vehicle = $repository->find($id);
        $service->finishVehicleService($vehicle);
        return $this->json($vehicle);
    }

    #[Route('/api/vehicle/{id}/edit', methods: 'POST')]
    public function edit(
        int $id,
        Request $request,
        VehicleRepository $repository,
        BrandRepository $brandRepository,
        VehicleModelRepository $modelRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse{
        $current = $repository->find($id);
        $data = json_decode($request->getContent(), true);

        if (isset($data['type'])) $current->setType($data['type']);
        if (isset($data['reg_number'])) $current->setRegNumber($data['reg_number']);
        if (isset($data['vin_number'])) $current->setVinNumber($data['vin_number']);
        if (isset($data['productionYear'])) $current->setProductionYear($data['productionYear']);
        if (isset($data['brand_id'])) {
            $brand = $brandRepository->find($data['brand_id']);
            $current->setBrand($brand);
        }
        if (isset($data['model_id'])) {
            $model = $modelRepository->find($data['model_id']);
            $current->setModel($model);
        }

        $entityManager->flush();

        return $this->json($current);
    }

    #[Route('/api/vehicle/{id}', methods: 'DELETE')]
    public function destroy(
        int $id,
        VehicleRepository $repository,
        VehicleService $service,
    ): JsonResponse{
        $vehicle = $repository->find($id);
        $service->removeVehicle($vehicle);

        return $this->json(['success' => true]);
    }

    #[Route('/api/vehicle/{id}/history', methods: 'GET')]
    public function history(
        int $id,
        VehicleHistoryRepository $history){
            return $this->json($history->findBy(['vehicle' => $id])); 
        }
}
