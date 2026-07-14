<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class BrandInUseException extends Exception{
    public function __construct(string $name){
        parent::__construct("{$name} is in use by existing vehicles");
    }
}
?>