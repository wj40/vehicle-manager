<?php
namespace App\Enum;

enum VehicleStatus: string{
    case Available = 'available';
    case Rented = 'rented';
    case Service = 'service';
}