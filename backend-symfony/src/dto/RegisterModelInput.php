<?php

namespace App\dto;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterModelInput{
    public function __construct(
        #[Assert\NotBlank]
        public string $name,

        #[Assert\NotBlank]
        public int $brand_id
    ){}
}