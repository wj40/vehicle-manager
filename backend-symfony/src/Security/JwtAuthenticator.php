<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

/**
 * @see https://symfony.com/doc/current/security/custom_authenticator.html
 */
class JwtAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private string $jwtSecret
    ) {
    }
    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization')
            && str_starts_with($request->headers->get('Authorization'), 'Bearer ');
    }

    public function authenticate(Request $request): Passport
    {
        $header = $request->headers->get('Authorization');
        $token = substr($header, 7);

        if(!$token){
            throw new CustomUserMessageAuthenticationException('No API token provided');
        }

        try{
            $decoded = \Firebase\JWT\JWT::decode(
                $token,
                new \Firebase\JWT\Key($this->jwtSecret, 'HS256')
            );
        }catch(\Exception $e){
            throw new CustomUserMessageAuthenticationException('Invalid or expired token');
        }

        $login = $decoded->login ?? null;

        if(!$login){
            throw new CustomUserMessageAuthenticationException('Invalid token payload');
        }

        return new SelfValidatingPassport(new UserBadge($login));
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'error' => strtr($exception->getMessageKey(), $exception->getMessageData()),
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }
}
