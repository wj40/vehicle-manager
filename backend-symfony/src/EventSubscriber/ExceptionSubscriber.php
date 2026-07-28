<?php

namespace App\EventSubscriber;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ExceptionSubscriber implements EventSubscriberInterface
{
    public function onExceptionEvent(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        $statusCode = match(true){
            $exception instanceof NotFoundHttpException => Response::HTTP_NOT_FOUND,
            $exception instanceof AuthenticationException => Response::HTTP_UNAUTHORIZED,
            $exception instanceof HttpException => $exception->getStatusCode(),
            default => Response::HTTP_INTERNAL_SERVER_ERROR,
        };

        $response = new JsonResponse([
            'error' => $exception->getMessage(),
            'class' => get_class($exception),
        ], $statusCode);

        $event->setResponse($response);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ExceptionEvent::class => 'onExceptionEvent',
        ];
    }
}
