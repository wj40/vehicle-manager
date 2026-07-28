<?php

namespace App\dto;

use Symfony\Component\Validator\Constraints as Assert;

class EditModelInput{
    public function __construct(
        #[Assert\NotBlank]
        public string $name,
    ){}
}