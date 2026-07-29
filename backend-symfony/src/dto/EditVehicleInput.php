<?php

namespace App\dto;

use App\Entity\Vehicle;
use App\Enum\VehicleType;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

#[UniqueEntity(
    entityClass: Vehicle::class,
    fields: ['regNumber'],
    message: 'Vehicle with this registration number already exists',
    errorPath: 'regNumber',
    identifierFieldNames: ['id'],
    )]
#[UniqueEntity(
    entityClass: Vehicle::class,
    fields: ['vinNumber'],
    message: 'Vehicle with this vin number already exists',
    errorPath: 'vinNumber',
    identifierFieldNames: ['id'])]
class EditVehicleInput{
    public ?int $id=null;
    public function __construct(

        public ?VehicleType $type=null,

        public ?int $brand_id=null,

        public ?int $model_id=null,

        #[Assert\Length(max: 14, maxMessage: 'Registration number is too long')]
        public ?string $reg_number=null,

        #[Assert\Length(exactly: 17)]
        public ?string $vin_number=null,

        #[Assert\Range(min: 1900, minMessage: 'Vehicle is too old')]
        public ?int $productionYear=null,
    ) {}
}