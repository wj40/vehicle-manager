<?php
namespace Wjagusiak\VehicleManager\Entity;

use Wjagusiak\VehicleManager\Enum\VehicleType;
use Wjagusiak\VehicleManager\Interface\Displayable;
use Wjagusiak\VehicleManager\Repository\VehicleRepository;

class Vehicle implements Displayable{
    protected VehicleType $vehicleType;
    protected ?int $id;
    protected int $brandId;
    protected int $modelId;
    protected string $reg_number;
    protected string $vin_number;
    protected int $productionYear;
    protected string $status;


    public function getId(): int{
        return $this->id;
    }
    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getVehicleType(): VehicleType {
        return $this->vehicleType;
    }

    public function setVehicleType(VehicleType $vehicleType): void{
        $this->vehicleType = $vehicleType;
    }

    public function getBrandId(): int {
        return $this->brandId;
    }

    public function setBrandId(int $brandId): void{
        $this->brandId = $brandId;
    }

    public function getModelId(): int {
        return $this->modelId;
    }

    public function setModelId(int $modelId): void{
        $this->modelId = $modelId;
    }

    public function getRegNumber(){
        return $this->reg_number;
    }

    public function setRegNumber(string $reg_number){
        $this->reg_number = $reg_number;
    }
    
    public function getVinNumber(){
        return $this->vin_number;
    }

    public function setVinNumber(string $vin_number){
        $this->vin_number = $vin_number;
    }

    public function getProductionYear() {
        return $this->productionYear;
    }

    public function setProductionYear(int $productionYear): void{
        $this->productionYear = $productionYear;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setStatus(string $status): void{
        $this->status = $status;
    }

    // wywolywane z VehicleService, zmienia status obiektu i wysyla zmiane do bazy
    public function changeStatus(string $status): void{
        $this->status = $status;
        $update = new VehicleRepository;
        $update->update($this);
    }

    // zamienia obiekt na zwykla tablice do json_encode
    public function toArray(): array{
        return [
            "id" => $this->id,
            "type" => $this->vehicleType->value,
            "brand_id" => $this->brandId,
            "model_id" => $this->modelId,
            "reg_number" => $this->reg_number,
            "vin_number" => $this->vin_number,
            "productionYear" => $this->productionYear,
            "status" => $this->status,
        ];
    }

    public function display(): string{
        return "Id: {$this->id}\n<br>
                Type: {$this->getVehicleType()->value}\n<br>
                Brand: {$this->brandId}\n<br>
                Model: {$this->modelId}\n<br>
                Registration number: {$this->reg_number}\n<br>
                Vin number: {$this->vin_number}\n<br>
                Production Year: {$this->productionYear}\n<br>
                Status: {$this->status}";
    }
}
?>