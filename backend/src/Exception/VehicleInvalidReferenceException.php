<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class VehicleInvalidReferenceException extends Exception{
    public function __construct(){
        parent::__construct("Invalid brand or model");
    }
}
?>