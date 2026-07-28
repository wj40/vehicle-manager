<?php

namespace App\Repository;

use App\Entity\Vehicle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Vehicle>
 */
class VehicleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Vehicle::class);
    }

    public function findAllWithJoins(): array{
        return $this->createQueryBuilder('v')
        ->leftJoin('v.brand', 'b')->addSelect('b')
        ->leftJoin('v.model', 'm')->addSelect('m')
        ->getQuery()->getResult();
    }

    public function findByIdWithJoins(int $id): ?Vehicle{
        return $this->createQueryBuilder('v')
            ->leftJoin('v.brand', 'b')->addSelect('b')
            ->leftJoin('v.model', 'm')->addSelect('m')
            ->where('v.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return Vehicle[] Returns an array of Vehicle objects
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

    //    public function findOneBySomeField($value): ?Vehicle
    //    {
    //        return $this->createQueryBuilder('v')
    //            ->andWhere('v.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
