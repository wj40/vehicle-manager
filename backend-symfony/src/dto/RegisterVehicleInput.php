<?php

namespace App\dto;

use App\Entity\Vehicle;
use App\Enum\VehicleStatus;
use App\Enum\VehicleType;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[UniqueEntity(
    entityClass: Vehicle::class,
    fields: ['reg_number'],
    message: 'Vehicle with this registration number already exists',
    errorPath: 'reg_number')]
#[UniqueEntity(
    entityClass: Vehicle::class,
    fields: ['vin_number'],
    message: 'Vehicle with this vin number already exists',
    errorPath: 'vin_number')]
class RegisterVehicleInput{
    public function __construct(
        #[Assert\NotNull(message: 'Wrong vehicle Type')]
        public VehicleType $type,

        #[Assert\NotNull(message: 'Selected brand not found')]
        public int $brand_id,

        #[Assert\NotNull(message: 'Selected model not found')]
        public int $model_id,

        #[Assert\NotBlank]
        #[Assert\Length(max: 14, maxMessage: 'Registration number is too long')]
        public string $reg_number,

        #[Assert\NotBlank]
        #[Assert\Length(exactly: 17)]
        public string $vin_number,

        #[Assert\NotNull()]
        #[Assert\Range(min: 1900, minMessage: 'Vehicle is too old')]
        public string $productionYear,

        #[Assert\NotNull]
        public VehicleStatus $status
    ) {}
}