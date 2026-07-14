<?php
namespace Wjagusiak\VehicleManager\Exception;

use Exception;

class VehicleAlreadyRentedException extends Exception{
    public function __construct(int $id){
        parent::__construct("Vehicle with id {$id} is already rented");
    }
}
?>