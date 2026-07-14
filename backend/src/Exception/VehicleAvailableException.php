<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class VehicleAvailableException extends Exception{
    public function __construct(int $id){
        parent::__construct("Vehicle with id {$id} is already available");
    }
}
?>