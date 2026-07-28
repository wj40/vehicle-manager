<?php

namespace App\Controller;

use App\Repository\BrandRepository;
use App\Repository\VehicleModelRepository;
use App\Repository\VehicleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use App\Entity\Vehicle;
use App\Repository\VehicleHistoryRepository;
use App\Service\VehicleService;
use App\dto\RegisterVehicleInput;
use App\dto\EditVehicleInput;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class VehicleController extends AbstractController
{
    private function vehicleToArray(Vehicle $v): array{
        return [
            'id' => $v->getId(),
            'type' => $v->getType(),
            'reg_number' => $v->getRegNumber(),
            'vin_number' => $v->getVinNumber(),
            'productionYear' => $v->getProductionYear(),
            'status' => $v->getStatus(),
            'created_at' => $v->getCreatedAt()?->format('Y-m-d H:i:s'),
            'brand_id' => $v->getBrand()?->getId(),
            'model_id' => $v->getModel()?->getId(),
            'brand_name' => $v->getBrand()?->getName(),
            'model_name' => $v->getModel()?->getName(),
        ];
    }

    #[Route('/api/vehicle', methods: ['GET'])]
    public function index(VehicleRepository $repository): JsonResponse{
        return $this->json(array_map(fn($v) => $this->vehicleToArray($v), $repository->findAllWithJoins()));
    }

    #[Route('/api/vehicle/{id}', methods: ['GET'])]
    public function show(#[MapEntity(expr: 'repository.findByIdWithJoins(id)')] Vehicle $vehicle): JsonResponse{
        return $this->json($this->vehicleToArray($vehicle));
    }

    #[Route('/api/vehicle', methods: ['POST'])]
    public function store(
        #[MapRequestPayload] RegisterVehicleInput $input,
        EntityManagerInterface $entityManager,
        BrandRepository $brandRepository,
        VehicleModelRepository $modelRepository,
    ): JsonResponse{
        $brand = $brandRepository->find($input->brand_id);
        $model = $modelRepository->find($input->model_id);
    
        $vehicle = new Vehicle();
        $vehicle->setType($input->type);
        $vehicle->setRegNumber($input->reg_number);
        $vehicle->setVinNumber($input->vin_number);
        $vehicle->setProductionYear((int) $input->productionYear);
        $vehicle->setStatus($input->status);
        $vehicle->setCreatedAt(new \DateTimeImmutable());

        if(!$brand){
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException("Selected brand not found");
        }
        if(!$model){
            throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException("Selected model not found");
        }
        $vehicle->setBrand($brand);
        $vehicle->setModel($model);

        $entityManager->persist($vehicle);
        $entityManager->flush();

        return $this->json(['message' => 'Vehicle registered', 'vehicle' => $this->vehicleToArray($vehicle)], 201);
    }

    #[Route('/api/vehicle/{id}/rent', methods: 'POST')]
    public function rent(
        #[MapEntity(expr: 'repository.findByIdWithJoins(id)')] Vehicle $vehicle, 
        VehicleService $service): JsonResponse{
            
        $service->rentVehicle($vehicle);
        return $this->json($this->vehicleToArray($vehicle));
    }

    #[Route('/api/vehicle/{id}/return', methods: 'POST')]
    public function returnVehicle(
        #[MapEntity(expr: 'repository.findByIdWithJoins(id)')] Vehicle $vehicle,
        VehicleService $service): JsonResponse{
        $service->returnVehicle($vehicle);
        return $this->json($this->vehicleToArray($vehicle));
    }

    #[Route('/api/vehicle/{id}/service', methods: 'POST')]
    public function sendToService(
        #[MapEntity(expr: 'repository.findByIdWithJoins(id)')] Vehicle $vehicle,
        VehicleService $service): JsonResponse{
        $service->sendVehicleToService($vehicle);
        return $this->json($this->vehicleToArray($vehicle));
    }

    #[Route('/api/vehicle/{id}/finish-service', methods: 'POST')]
    public function finishService(
        #[MapEntity(expr: 'repository.findByIdWithJoins(id)')] Vehicle $vehicle,
        VehicleService $service): JsonResponse{
        $service->finishVehicleService($vehicle);
        return $this->json($this->vehicleToArray($vehicle));
    }

    #[Route('/api/vehicle/{id}/edit', methods: 'POST')]
    public function edit(
        #[MapEntity(expr: 'repository.findByIdWithJoins(id)')] Vehicle $current,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        Request $request,
        BrandRepository $brandRepository,
        VehicleModelRepository $modelRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse{
        $input = $serializer->deserialize(
            $request->getContent(),
            EditVehicleInput::class,
            'json'
            );
            $input->id = $current->getId();

        $errors = $validator->validate($input);
        if($errors->count()){
            return $this->json($errors, 422);
        }

        if (isset($input->type)) $current->setType($input->type);
        if (isset($input->reg_number)) $current->setRegNumber($input->reg_number);
        if (isset($input->vin_number)) $current->setVinNumber($input->vin_number);
        if (isset($input->productionYear)) $current->setProductionYear($input->productionYear);
        if (isset($input->brand_id)) {
            $brand = $brandRepository->find($input->brand_id);
            $current->setBrand($brand);
        }
        if (isset($input->model_id)) {
            $model = $modelRepository->find($input->model_id);
            $current->setModel($model);
        }

        $entityManager->flush();

        return $this->json($this->vehicleToArray($current));
    }

    #[Route('/api/vehicle/{id}', methods: 'DELETE')]
    public function destroy(
        #[MapEntity] Vehicle $vehicle,
        VehicleService $service,
    ): JsonResponse{
        $service->removeVehicle($vehicle);
        return $this->json(['success' => true]);
    }

    #[Route('/api/vehicle/{id}/history', methods: 'GET')]
    public function history(
        #[MapEntity] Vehicle $vehicle,
        VehicleHistoryRepository $history){
            $records = $history->findByVehicleId($vehicle->getId());
            return $this->json(array_map(fn($h) => [
                'id' => $h->getId(),
                'vehicle_id' => $h->getVehicle()?->getId(),
                'action' => $h->getAction(),
                'old_status' => $h->getOldStatus(),
                'new_status' => $h->getNewStatus(),
                'changed_at' => $h->getChangedAt()?->format('Y-m-d H:i:s'),
            ], $records)); 
        }
}
