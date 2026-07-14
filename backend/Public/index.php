<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Wjagusiak\VehicleManager\Controller\VehicleController;
use Wjagusiak\VehicleManager\Exception\VehicleAlreadyRentedException;
use Wjagusiak\VehicleManager\Exception\VehicleAvailableException;
use Wjagusiak\VehicleManager\Exception\VehicleInServiceException;
use Wjagusiak\VehicleManager\Exception\VehicleNotFoundException;
use Wjagusiak\VehicleManager\Exception\VehicleWrongStatus;
use Wjagusiak\VehicleManager\Exception\VehicleWrongType;

$route = $_GET['route'] ?? '';

// wszystko zwiazane z API zaczyna sie od "api/" w route
if (str_starts_with($route, 'api/')) {

    // CORS - frontend (Vite, localhost:5173) i backend (XAMPP) to inny origin dla przegladarki
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    // przegladarka przed "prawdziwym" requestem wysyla OPTIONS (preflight) - odpowiadamy pusto i konczymy
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    $method = $_SERVER['REQUEST_METHOD'];

    // "api/vehicle/x/rent" -> ["api", "vehicle", "x", "rent"]
    $segments = explode('/', trim($route, '/'));

    // segments[0] = "api", segments[1] = "vehicle", segments[2] = id (opcjonalnie), segments[3] = akcja (opcjonalnie)
    $id = isset($segments[2]) ? (int)$segments[2] : null;
    
    $action = $segments[3] ?? null;

    $controller = new VehicleController();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    try{
        if ($method === 'GET' && $id === null) {
            $result = $controller->index();
            http_response_code(200);
        } elseif ($method === 'GET' && $id !== null && $action === null) {
            $result = $controller->show($id);
            http_response_code(200);
        } elseif ($method === 'POST' && $id === null) {
            $result = $controller->store($body);
            http_response_code(201);
        } elseif ($method === 'POST' && $action === 'rent') {
            $result = $controller->rent($id);
            http_response_code(200);
        } elseif ($method === 'POST' && $action === 'return') {
            $result = $controller->returnVehicle($id);
            http_response_code(200);
        } elseif ($method === 'POST' && $action === 'service') {
            $result = $controller->sendToService($id);
            http_response_code(200);
        } elseif ($method === 'POST' && $action === 'finish-service') {
            $result = $controller->finishService($id);
            http_response_code(200);
        } elseif ($method === 'DELETE' && $id !== null) {
            $result = $controller->destroy($id);
            http_response_code(200);
        } elseif ($method === 'GET' && $action ==='history'){
            $result = $controller->history($id);
            http_response_code(200);
        } else {
            http_response_code(404);
            $result = ['error' => 'Unknown route'];
        }
    } catch (VehicleNotFoundException $e) {
        http_response_code(404);
        $result = ['error' => $e->getMessage()];
    } catch (VehicleAlreadyRentedException $e) {
        http_response_code(409);
        $result = ['error' => $e->getMessage()];
    } catch (VehicleInServiceException $e) {
        http_response_code(409);
        $result = ['error' => $e->getMessage()];
    } catch (VehicleWrongType $e) {
        http_response_code(400);
        $result = ['error' => $e->getMessage()];
    } catch (VehicleWrongStatus $e) {
        http_response_code(400);
        $result = ['error' => $e->getMessage()];
    }catch (VehicleAvailableException $e) {
        http_response_code(409);
        $result = ['error' => $e->getMessage()];
    } catch (\RuntimeException $e) {
        http_response_code(500);
        $result = ['error' => $e->getMessage()];
    }

    echo json_encode($result);
    exit;
}
header('Content-Type: application/json');
http_response_code(404);
echo json_encode(['error' => 'Not found']);
?>