<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class VehicleWrongType extends Exception{
    public function __construct(){
        parent::__construct("Wrong vehicle type.");
    }
}
?>