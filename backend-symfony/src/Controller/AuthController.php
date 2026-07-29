<?php

namespace App\Controller;

use App\dto\UserEditInput;
use App\dto\UserInput;
use App\Entity\Roles;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
// use PhpParser\Node\Name;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

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
            'role' => $user->getRoles()
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
        $user->setRole(Roles::ROLE_USER);

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
    
    private function usersToArray(User $u): array{
        return [
            'id' => $u->getId(),
            'login' => $u->getLogin(),
            'email' => $u->getEmail(),
            'role' => ($u->getRoles())[0] ?? 'ROLE_USER',
        ];
    }
    
    #[Route('/api/users', methods: ['GET'])]
    public function getUsers(UserRepository $repository): JsonResponse{
        return $this->json(array_map(fn($u) => $this->usersToArray($u), $repository->findAll()));
    }

    #[Route('/api/user/{id}', methods: ['GET'])]
    public function getUserById(
        #[MapEntity] User $user,
    ):JsonResponse{
        return $this->json($this->usersToArray($user));
    }

    #[Route('/api/user/{id}', methods: ['DELETE'])]
    public function destroyUser(
        #[MapEntity] User $user,
        EntityManagerInterface $entityManager,
    ): JsonResponse{
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/change/{id}', methods: ['POST'])]
    public function changePassword(
        Request $request,
        #[MapEntity] User $user,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
        ): JsonResponse{
            $data = json_decode($request->getContent(), true);
            if(!$user) return $this->json(['error' => 'User not found'], 404);
            $passwordHash = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($passwordHash);
            
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->json(['message' => 'Password changed'], 201);
        }

    #[Route('/api/edituser/{id}', methods: ['POST'])]
    public function editUser(
        // #[MapRequestPayload] UserEditInput $input,
        #[MapEntity] User $user,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        Request $request,
        EntityManagerInterface $entityManager,
    ): JsonResponse{
        $input = $serializer->deserialize(
            $request->getContent(),
            UserEditInput::class,
            'json'
        );
        $input->id = $user->getId();

        $errors = $validator->validate($input);
        if($errors->count()){
            return $this->json(['error' => $errors->get(0)->getMessage()], 422);
        }

        if(isset($input->login)) $user->setLogin($input->login);
        if(isset($input->email)) $user->setEmail($input->email);
        if(isset($input->role)){
            if($input->role == "ROLE_ADMIN"){
                $user->setRole(Roles::ROLE_ADMIN);
            }else if ($input->role == "ROLE_USER"){
                $user->setRole(Roles::ROLE_USER);
            }
        }

        $entityManager->flush();

        return $this->json($this->usersToArray($user));
    }
}