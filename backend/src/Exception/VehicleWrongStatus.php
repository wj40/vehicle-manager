<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class VehicleWrongStatus extends Exception{
    public function __construct(){
        parent::__construct("Wrong status");
    }
}
?>