<?php

namespace App\Repository;

use App\Entity\VehicleHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VehicleHistory>
 */
class VehicleHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VehicleHistory::class);
    }

    public function findByVehicleId(int $vehicleId): array{
        return $this->createQueryBuilder('h')
            ->leftJoin('h.vehicle', 'v')->addSelect('v')
            ->where('h.vehicle = :vehicleId')
            ->setParameter('vehicleId', $vehicleId)
            ->getQuery()
            ->getResult();
    }

    //    /**
    //     * @return VehicleHistory[] Returns an array of VehicleHistory objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('v.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?VehicleHistory
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
