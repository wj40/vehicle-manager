<?php
namespace App\Enum;

enum RentalStatus: string{
    case Active = 'active';
    case Returned = 'returned';
}
