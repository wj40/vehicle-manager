<?php

namespace App\dto;

use App\Entity\User;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[UniqueEntity(
    entityClass: User::class,
    fields: ['login'],
    message: 'User with this login already exists.',
    errorPath: 'login',
    identifierFieldNames: ['id'],
    )]
#[UniqueEntity(
    entityClass: User::class,
    fields: ['email'],
    message: 'User with this email already exists.',
    errorPath: 'email',
    identifierFieldNames: ['id'],
    )]
class UserEditInput{
    public ?int $id=null;
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 180, maxMessage: 'Login is too long')]
        public ?string $login,

        #[Assert\NotBlank]
        #[Assert\Length(max: 180, maxMessage: 'Email is too long')]
        #[Assert\Email]
        public ?string $email,

        #[Assert\Choice(choices: ['ROLE_ADMIN','ROLE_MANAGER','ROLE_USER'])]
        public ?string $role,
    ) {}
}