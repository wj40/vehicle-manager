<?php

namespace App\dto;

use App\Entity\Brand;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[UniqueEntity(
    entityClass: Brand::class,
    fields: ['name'],
    message: 'Brand with this name already exists',
    errorPath: 'name')]
class RegisterBrandInput{
    public function __construct(
        #[Assert\NotBlank]
        public string $name
    ){}
}