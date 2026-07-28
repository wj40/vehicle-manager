<?php
namespace App\Enum;

enum VehicleType: string{
    case Car = 'car';
    case Truck = 'truck';
    case Motorcycle = 'motorcycle';
    case Bus = 'bus';
}