<?php

namespace App\Service;

use App\Entity\Client;
use App\Entity\Rental;
use App\Entity\Vehicle;
use App\Entity\VehicleHistory;
use App\Enum\RentalStatus;
use App\Enum\VehicleStatus;
use Doctrine\ORM\EntityManagerInterface;

class RentalService
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ){}

    public function quote(Vehicle $vehicle, string $startDate, string $endDate): array
    {
        $start = new \DateTimeImmutable($startDate);
        $end = new \DateTimeImmutable($endDate);
        $days = $this->calculateDays($start, $end);

        $price = (float) $vehicle->getPrice();
        $discount = $this->calculateDiscount($days);
        $total = round($price * $days * (1 - $discount / 100), 2);

        return [
            'days' => $days,
            'discount_pct' => $discount,
            'price_per_day' => $price,
            'total' => $total,
        ];
    }

    public function rent(Vehicle $vehicle, Client $client, string $startDate, string $endDate, ?string $pesel = null): Rental
    {
        $status = $vehicle->getStatus();
        if ($status === VehicleStatus::Rented) {
            throw new \Exception('Vehicle is already rented');
        }
        if ($status === VehicleStatus::Service) {
            throw new \Exception('Vehicle is in service');
        }

        if ($client->getPesel() === null && $pesel !== null) {
            $client->setPesel($pesel);
        }

        $quote = $this->quote($vehicle, $startDate, $endDate);

        $rental = new Rental();
        $rental->setVehicle($vehicle);
        $rental->setClient($client);
        $rental->setStartDate(new \DateTimeImmutable($startDate));
        $rental->setEndDate(new \DateTimeImmutable($endDate));
        $rental->setDays($quote['days']);
        $rental->setPricePerDay((string) $quote['price_per_day']);
        $rental->setDiscountPct($quote['discount_pct']);
        $rental->setTotalPrice((string) $quote['total']);
        $rental->setStatus(RentalStatus::Active);
        $rental->setCreatedAt(new \DateTimeImmutable());

        $history = new VehicleHistory();
        $history->setVehicle($vehicle);
        $history->setAction('rent');
        $history->setOldStatus($vehicle->getStatus()->value);
        $history->setNewStatus('rented');
        $history->setChangedAt(new \DateTimeImmutable());

        $currentBalance = $client->getBalance() !== null ? (float) $client->getBalance() : 0.0;
        $client->setBalance((string) round($currentBalance - $quote['total'], 2));

        $vehicle->setStatus(VehicleStatus::Rented);

        $this->entityManager->persist($rental);
        $this->entityManager->persist($history);
        $this->entityManager->flush();

        return $rental;
    }

    public function returnRental(Vehicle $vehicle): void
    {
        $activeRental = $this->entityManager->getRepository(Rental::class)->findOneBy([
            'vehicle' => $vehicle,
            'status' => RentalStatus::Active,
        ]);

        if ($vehicle->getStatus() === VehicleStatus::Available && $activeRental === null) {
            throw new \Exception('Vehicle is not rented');
        }

        if ($activeRental !== null) {
            $activeRental->setStatus(RentalStatus::Returned);
        }

        $history = new VehicleHistory();
        $history->setVehicle($vehicle);
        $history->setAction('return');
        $history->setOldStatus($vehicle->getStatus()?->value);
        $history->setNewStatus('available');
        $history->setChangedAt(new \DateTimeImmutable());

        $vehicle->setStatus(VehicleStatus::Available);

        $this->entityManager->persist($history);
        $this->entityManager->flush();
    }

    private function calculateDays(\DateTimeImmutable $start, \DateTimeImmutable $end): int
    {
        if ($end <= $start) {
            throw new \Exception('End date must be after start date');
        }

        return $start->diff($end)->days;
    }

    private function calculateDiscount(int $days): int
    {
        if ($days > 30) return 15;
        if ($days > 25) return 10;
        if ($days > 20) return 5;

        return 0;
    }
}
