<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class VehicleAlreadyExistException extends Exception{
    public function __construct(string $name){
        parent::__construct("{$name} with this credentials already exist.");
    }
}
?>