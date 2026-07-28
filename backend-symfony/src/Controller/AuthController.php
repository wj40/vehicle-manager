<?php

namespace App\Controller;

use App\dto\UserInput;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
// use PhpParser\Node\Name;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

final class AuthController extends AbstractController
{   
    public function __construct(private MailerInterface $mailer){}

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
            'email' => $user->getEmail(),
        ]);
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] UserInput $input,
        EntityManagerInterface $entityManager,
        \App\Repository\UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse{
        $user = new User();

        $user->setLogin($input->login);
        $user->setEmail($input->email);
        $passwordHash = $passwordHasher->hashPassword($user, $input->password);
        $user->setPassword($passwordHash);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User created successfully'], 201);
    }

    #[Route('/api/sendemail', name: 'api_sendemail', methods: ['POST'])]
    public function sendemail(
        Request $request,
        \App\Repository\UserRepository $userRepository,
    ): JsonResponse{
        $data = json_decode($request->getContent(), true);
        $login = $data['login'] ?? '';

        $user = $userRepository->findOneBy(['login' => $login]);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }
        $email = $user->getEmail();
        $frontendUrl = $_SERVER['FRONTEND_URL'] ?? 'http://localhost';
        $resetLink = "$frontendUrl/reset/$email";
        $email = (new Email())
            ->from('siemsiem@resend.dev')
            ->to($email)
            ->subject('resetowanie hasla')
            ->html("<a href='$resetLink'><button>Reset password</button></a>");

        try{
            $this->mailer->send($email);
        }catch(\Exception $e){
            throw new Exception($e -> getMessage());
        }
        return $this->json(['message' => 'email send successfully'], 201);
    }

    #[Route('/api/reset', methods: ['POST'])]
    public function resetPassword(
        Request $request,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
        ): JsonResponse{
            $data = json_decode($request->getContent(), true);
            $user = $userRepository->findOneBy(['email' => $data['email']]);
            if(!$user) return $this->json(['error' => 'User not found'], 404);
            $passwordHash = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($passwordHash);
            
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->json(['message' => 'Password changed'], 201);
        }   
}