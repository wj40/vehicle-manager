<?php

namespace App\dto;

use Symfony\Component\Validator\Constraints as Assert;

class QuoteVehicleInput{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Date]
        public string $start_date,

        #[Assert\NotBlank]
        #[Assert\Date]
        public string $end_date,
    ) {}
}
