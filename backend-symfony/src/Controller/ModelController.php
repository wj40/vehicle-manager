<?php

namespace App\Controller;

use App\dto\EditModelInput;
use App\dto\RegisterModelInput;
use App\Entity\VehicleModel;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\VehicleModelRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Brand;
use App\Repository\BrandRepository;
use App\Repository\VehicleRepository;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class ModelController extends AbstractController
{
    #[Route('/api/models/{brandId}', methods: ['GET'])]
    public function models(int $brandId, VehicleModelRepository $repository): JsonResponse{
        // return $this->json($repository->findBy(['brand' => $brandId]));
        return $this->json(array_map(fn($m) => 
        ['id' => $m->getId(), 'name' => $m->getName()], $repository->findBy(['brand' => $brandId])));
    }

    #[Route('/api/models', methods: ['POST'])]
    public function storeModel(
        #[MapRequestPayload] RegisterModelInput $input,
        EntityManagerInterface $entityManager,
        BrandRepository $brandRepository,
        VehicleModelRepository $repository
    ): JsonResponse{
        if(!$brandRepository->find($input->brand_id)) throw new NotFoundHttpException("Brand not found");
        $model = new VehicleModel();
        $existing = $repository->findOneBy(['name' => $input->name, 'brand' => $input->brand_id]);
        if ($existing) throw new BadRequestHttpException("Model already exists for this brand");

        $brand = $entityManager->getReference(Brand::class, $input->brand_id);
        $model->setBrand($brand);
        $model->setName($input->name);

        $entityManager->persist($model);
        $entityManager->flush();

        return $this->json($model, 201);
    }

    #[Route('/api/models/{id}', methods: ['POST'])]
    public function updateModel(
        #[MapEntity] VehicleModel $current,
        #[MapRequestPayload] EditModelInput $input,
        EntityManagerInterface $entityManager,
        VehicleModelRepository $repository
    ): JsonResponse{
        if (isset($input->name) && $input->name !== $current->getName()) {
            if ($repository->findOneBy(['name' => $input->name, 'brand' => $current->getBrand()->getId()]))
                throw new BadRequestHttpException("Model already exists for this brand");
            $current->setName($input->name);
        }

        $entityManager->flush();

        return $this->json($current);
    }

    #[Route('/api/models/{id}', methods: ['DELETE'])]
    public function destroyModel(
        #[MapEntity] VehicleModel $model,
        VehicleRepository $repository,
        EntityManagerInterface $entityManager
    ): JsonResponse{
        if ($repository->findOneBy(['model' => $model->getId()])) {
            throw new \Symfony\Component\HttpKernel\Exception\BadRequestHttpException("Model is in use");
        }

        $entityManager->remove($model);
        $entityManager->flush();

        return $this->json(['success' => true]);
    }
}
