<?php
namespace App\Controller;

use App\Entity\User;
use App\dto\UserEditInput;
use App\Enum\UserRole;
use App\Repository\UserRepository;
use App\Security\Voter\UserVoter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserController extends AbstractController{
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
        $this->denyAccessUnlessGranted(UserVoter::DELETE, $user);

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
            $this->denyAccessUnlessGranted(UserVoter::EDIT, $user);

            $data = json_decode($request->getContent(), true);

            $passwordHash = $passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($passwordHash);
            
            $entityManager->persist($user);
            $entityManager->flush();

            return $this->json(['message' => 'Password changed'], 201);
        }

    #[Route('/api/edituser/{id}', methods: ['POST'])]
    #[IsGranted(attribute: UserVoter::EDIT, subject: 'user')]
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
            $currentRole = ($user->getRoles())[0] ?? 'ROLE_USER';

            if ($currentRole !== $input->role) {
                if (!$this->isGranted(UserVoter::EDIT_ROLE, $user)) {
                    return $this->json(['error' => 'Only administrators can change user roles.'], 403);
                }
                switch($input->role){
                    case 'ROLE_ADMIN':
                        $user->setRole([UserRole::ADMIN->value]);
                        break;
                    case 'ROLE_MANAGER':
                        $user->setRole([UserRole::MANAGER->value]);
                        break;
                    case 'ROLE_USER':
                        $user->setRole([UserRole::USER->value]);
                        break;
                    default:
                        throw new BadRequestHttpException(sprintf('Role "%s" is not a valid role', $input->role));
                    
                } 
            }
               
            
            
        }

        $entityManager->flush();
        return $this->json($this->usersToArray($user));
    }

    #[Route('/api/me', methods: ['GET'])]
    public function getMe(): JsonResponse{
        $currentUser = $this->getUser();

        if(!$currentUser instanceof User){
            return $this->json(['error' => 'Not authenticated', 401]);
        }

        return $this->json($this->usersToArray($currentUser));
    }
}