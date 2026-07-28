<?php

namespace App\Controller;

use App\Entity\Brand;
use App\dto\RegisterBrandInput;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\BrandRepository;
use App\Repository\VehicleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;

final class BrandController extends AbstractController
{
    #[Route('/api/brands', methods: ['GET'])]
    public function brands(BrandRepository $repository): JsonResponse{
        // return $this->json($repository->findAll());
        return $this->json(array_map(fn($b) => 
        ['id' => $b->getId(), 'name' => $b->getName()], $repository->findAll()));
    }

    #[Route('/api/brands', methods: ['POST'])]
    public function storeBrand(
        #[MapRequestPayload] RegisterBrandInput $input,
        EntityManagerInterface $entityManager,
    ): JsonResponse{
        $brand = new Brand();

        $brand->setName($input->name);

        $entityManager->persist($brand);
        $entityManager->flush();

        return $this->json($brand, 201);
    }

    #[Route('/api/brands/{id}', methods: ['POST'])]
    public function updateBrand(
        #[MapEntity] Brand $current,
        #[MapRequestPayload] RegisterBrandInput $input,
        EntityManagerInterface $entityManager,
    ): JsonResponse{
        if(isset($input->name)) $current->setName($input->name);

        $entityManager->flush();

        return $this->json($current);
    }

    #[Route('/api/brands/{id}', methods: ['DELETE'])]
    public function destroyBrand(
        #[MapEntity] Brand $brand,
        VehicleRepository $repository,
        EntityManagerInterface $entityManager
    ): JsonResponse{
        if ($repository->findOneBy(['brand' => $brand->getId()])) {
            throw new \Symfony\Component\HttpKernel\Exception\BadRequestHttpException("Brand is in use");
        }

        $entityManager->remove($brand);
        $entityManager->flush();

        return $this->json(['success' => true]);
    }
}
