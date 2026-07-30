<?php
namespace App\Enum;

enum UserRole: string{
    case USER = 'ROLE_USER';
    case MANAGER = 'ROLE_MANAGER';
    case ADMIN = 'ROLE_ADMIN';
}