<?php

namespace App\Security\Voter;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserVoter extends Voter
{
    public const EDIT = 'USER_EDIT';
    public const EDIT_ROLE = 'USER_EDIT_ROLE';
    public const VIEW = 'USER_VIEW';
    public const DELETE = 'USER_DELETE';
    public const SOFT_DELETE = "USER_SOFT_DELETE";

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [self::EDIT, self::EDIT_ROLE, self::VIEW, self::DELETE])
            && $subject instanceof \App\Entity\User;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();


        if (!$user instanceof UserInterface) {
            $vote?->addReason('The user must be logged in to access this resource.');

            return false;
        }
 
        switch ($attribute) {
            case self::VIEW:
                return self::canView($user, $subject);

            case self::EDIT:
                return self::canEdit($user, $subject);

            case self::EDIT_ROLE:
                return self::canEditRole($user, $subject);

            case self::DELETE:
                return self::canDelete($user, $subject);
        }

        return false;
    }

    public static function canView(User $user, mixed $subject)
    {
        if (self::canDelete($user, $subject)) return true;

        if (self::canEdit($user, $subject)) return true;

        if (in_array('ROLE_ADMIN', $user->getRoles())) return true;

        if (in_array('ROLE_MANAGER', $user->getRoles())) return true;
        return false;
    }

    public static function canEdit(User $user, mixed $subject)
    {
        if (self::canEditRole($user, $subject)) return true;

        if (in_array('ROLE_ADMIN', $user->getRoles())) return true;

        if (in_array('ROLE_MANAGER', $user->getRoles())) return true;

        return $user === $subject;
    }

    public static function canEditRole(User $user, mixed $subject)
    {
        if (in_array('ROLE_ADMIN', $user->getRoles())) return true;

        return false;
    }

    public static function canDelete(User $user, mixed $subject)
    {
        if (in_array('ROLE_ADMIN', $user->getRoles())) return true;

        return $user === $subject;
    }
}
