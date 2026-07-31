<?php

namespace App\Controller;

use App\dto\RegisterClientInput;
use App\Entity\Client;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class ClientController extends AbstractController
{
    private function clientToArray(Client $c): array
    {
        return [
            'id' => $c->getId(),
            'cid' => $c->getCid(),
            'name' => $c->getName(),
            'surname' => $c->getSurname(),
            'b_date' => $c->getBDate()?->format('Y-m-d'),
            'pesel' => $c->getPesel(),
            'balance' => $c->getBalance() !== null ? (float) $c->getBalance() : null,
        ];
    }

    #[Route('/api/client', methods: ['GET'])]
    public function index(ClientRepository $repository, Request $request): JsonResponse
    {
        $query = $request->query->get('query', '');
        $clients = $query ? $repository->search($query) : $repository->findAll();

        return $this->json(array_map(fn($c) => $this->clientToArray($c), $clients));
    }

    #[Route('/api/client', methods: ['POST'])]
    public function store(
        #[MapRequestPayload] RegisterClientInput $input,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $client = new Client();
        $client->setName($input->name);
        $client->setSurname($input->surname);
        $client->setBDate(new \DateTimeImmutable($input->b_date));
        $client->setBalance('0.00');
        $client->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($client);
        $entityManager->flush();
        $entityManager->refresh($client);

        return $this->json(['message' => 'Client created', 'client' => $this->clientToArray($client)], 201);
    }
}
