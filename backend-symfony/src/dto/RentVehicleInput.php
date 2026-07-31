<?php

namespace App\dto;

use Symfony\Component\Validator\Constraints as Assert;

class RentVehicleInput{
    public function __construct(
        #[Assert\NotNull(message: 'Selected client not found')]
        public int $client_id,

        #[Assert\NotBlank]
        #[Assert\Date]
        public string $start_date,

        #[Assert\NotBlank]
        #[Assert\Date]
        public string $end_date,

        #[Assert\Length(exactly: 11, exactMessage: 'PESEL must have exactly 11 digits')]
        public ?string $pesel = null,
    ) {}
}
