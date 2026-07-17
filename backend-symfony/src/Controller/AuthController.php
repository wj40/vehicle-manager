<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        \App\Repository\UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $login = $data['login'] ?? '';
        $password = $data['password'] ?? '';

        if (!$login || !$password) {
            return $this->json(['error' => 'Login and password required'], 400);
        }

        $user = $userRepository->findOneBy(['login' => $login]);

        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $jwtSecret = $this->getParameter('jwt_secret');

        $payload = [
            'login' => $user->getUserIdentifier(),
            'iat' => time(),
            'exp' => time() + 3600,
        ];

        $token = \Firebase\JWT\JWT::encode($payload, $jwtSecret, 'HS256');

        return $this->json([
            'token' => $token,
            'login' => $user->getUserIdentifier(),
        ]);
    }
}