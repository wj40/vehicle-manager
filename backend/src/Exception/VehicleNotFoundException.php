<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class VehicleNotFoundException extends Exception{
    public function __construct(int $id){
        parent::__construct("No vehicle with id {$id}");
    }
}
?>