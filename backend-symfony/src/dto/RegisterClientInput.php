<?php

namespace App\dto;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterClientInput{
    public function __construct(
        #[Assert\NotBlank]
        public string $name,

        #[Assert\NotBlank]
        public string $surname,

        #[Assert\NotBlank]
        #[Assert\Date]
        public string $b_date,
    ) {}
}
