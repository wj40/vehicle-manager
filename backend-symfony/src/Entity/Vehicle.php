<?php

namespace App\Entity;

use App\Repository\VehicleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'vehicles')]
#[ORM\Entity(repositoryClass: VehicleRepository::class)]
class Vehicle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $type = null;

    #[ORM\Column(length: 14, nullable: true)]
    private ?string $regNumber = null;

    #[ORM\Column(length: 17, nullable: true)]
    private ?string $vinNumber = null;

    #[ORM\Column]
    private ?int $productionYear = null;

    #[ORM\Column(length: 20)]
    private ?string $status = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'vehicles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Brand $brand = null;

    #[ORM\ManyToOne(inversedBy: 'vehicles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?VehicleModel $model = null;

    /**
     * @var Collection<int, VehicleHistory>
     */
    #[ORM\OneToMany(targetEntity: VehicleHistory::class, mappedBy: 'vehicle')]
    private Collection $vehicleHistories;

    public function __construct()
    {
        $this->vehicleHistories = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getRegNumber(): ?string
    {
        return $this->regNumber;
    }

    public function setRegNumber(?string $regNumber): static
    {
        $this->regNumber = $regNumber;

        return $this;
    }

    public function getVinNumber(): ?string
    {
        return $this->vinNumber;
    }

    public function setVinNumber(?string $vinNumber): static
    {
        $this->vinNumber = $vinNumber;

        return $this;
    }

    public function getProductionYear(): ?int
    {
        return $this->productionYear;
    }

    public function setProductionYear(int $productionYear): static
    {
        $this->productionYear = $productionYear;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getBrand(): ?Brand
    {
        return $this->brand;
    }

    public function setBrand(?Brand $brand): static
    {
        $this->brand = $brand;

        return $this;
    }

    public function getModel(): ?VehicleModel
    {
        return $this->model;
    }

    public function setModel(?VehicleModel $model): static
    {
        $this->model = $model;

        return $this;
    }

    /**
     * @return Collection<int, VehicleHistory>
     */
    public function getVehicleHistories(): Collection
    {
        return $this->vehicleHistories;
    }

    public function addVehicleHistory(VehicleHistory $vehicleHistory): static
    {
        if (!$this->vehicleHistories->contains($vehicleHistory)) {
            $this->vehicleHistories->add($vehicleHistory);
            $vehicleHistory->setVehicle($this);
        }

        return $this;
    }

    public function removeVehicleHistory(VehicleHistory $vehicleHistory): static
    {
        if ($this->vehicleHistories->removeElement($vehicleHistory)) {
            // set the owning side to null (unless already changed)
            if ($vehicleHistory->getVehicle() === $this) {
                $vehicleHistory->setVehicle(null);
            }
        }

        return $this;
    }
}
