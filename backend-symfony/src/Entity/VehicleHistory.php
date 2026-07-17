<?php

namespace App\Entity;

use App\Repository\VehicleHistoryRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VehicleHistoryRepository::class)]
class VehicleHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    private ?string $action = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $oldStatus = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $newStatus = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $changedAt = null;

    #[ORM\ManyToOne(inversedBy: 'vehicleHistories')]
    private ?Vehicle $vehicle = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public function setAction(string $action): static
    {
        $this->action = $action;

        return $this;
    }

    public function getOldStatus(): ?string
    {
        return $this->oldStatus;
    }

    public function setOldStatus(?string $oldStatus): static
    {
        $this->oldStatus = $oldStatus;

        return $this;
    }

    public function getNewStatus(): ?string
    {
        return $this->newStatus;
    }

    public function setNewStatus(?string $newStatus): static
    {
        $this->newStatus = $newStatus;

        return $this;
    }

    public function getChangedAt(): ?\DateTimeImmutable
    {
        return $this->changedAt;
    }

    public function setChangedAt(?\DateTimeImmutable $changedAt): static
    {
        $this->changedAt = $changedAt;

        return $this;
    }

    public function getVehicle(): ?Vehicle
    {
        return $this->vehicle;
    }

    public function setVehicle(?Vehicle $vehicle): static
    {
        $this->vehicle = $vehicle;

        return $this;
    }
}
