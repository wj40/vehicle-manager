<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Wjagusiak\VehicleManager\Controller\VehicleController;
use Wjagusiak\VehicleManager\Exception\BrandInUseException;
use Wjagusiak\VehicleManager\Exception\VehicleAlreadyExistException;
use Wjagusiak\VehicleManager\Exception\VehicleAlreadyRentedException;
use Wjagusiak\VehicleManager\Exception\VehicleAvailableException;
use Wjagusiak\VehicleManager\Exception\VehicleInServiceException;
use Wjagusiak\VehicleManager\Exception\VehicleInvalidReferenceException;
use Wjagusiak\VehicleManager\Exception\VehicleNotFoundException;
use Wjagusiak\VehicleManager\Exception\VehicleWrongStatus;
use Wjagusiak\VehicleManager\Exception\VehicleWrongType;
use Firebase\JWT;
use Firebase\JWT\Key;
use Wjagusiak\VehicleManager\Repository\VehicleRepository;

$route = $_GET['route'] ?? '';

// wszystko zwiazane z API zaczyna sie od "api/" w route
if (str_starts_with($route, 'api/')) {

    // CORS - frontend (Vite, localhost:5173) i backend (XAMPP) to inny origin dla przegladarki
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
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
    $brandId = isset($segments[2]) ? (int)$segments[2] : null;
    $action = $segments[3] ?? null;

    // --------------------------------------------------------------
    $publicRoutes = ['api/login'];

    if(!in_array($route, $publicRoutes)){
        $authHeader = $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';
        
        if(!str_starts_with($authHeader, 'Bearer ')){
            http_response_code(401);
            echo json_encode(['error' => 'Missing or invalid token']);
            exit;
        }

        $token = substr($authHeader, 7);

        try{
            $decoded = Firebase\JWT\JWT::decode($token, new Firebase\JWT\Key(JWT_SECRET, 'HS256'));
            $authenticatedUserId = $decoded->userId;
        }catch(\Exception $e){
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }
    }
    // --------------------------------------------------------------

    $controller = new VehicleController();
    $repository = new VehicleRepository();
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // --------------------------------------------------------------

    if($method === 'POST' && $route === 'api/login'){
        $inputLogin = $body['login'] ?? '';
        $inputPassword = $body['password'] ?? '';

        $user = $repository->findUserByLogin($inputLogin);

        if(!$user || !password_verify($inputPassword, $user['password_hash'])){
            http_response_code(401);
            echo json_encode(['error' => "Invalid credentials"]);
            exit;
        }

        $payload = [
            'userId' => $user['id'],
            'login' => $user['login'],
            'exp' => time() + JWT_EXPIRY,
        ];

        $token = Firebase\JWT\JWT::encode($payload, JWT_SECRET, 'HS256');
        echo json_encode(['token' => $token, 'user' => ['id' => $user['id'], 'login' => $user['login']]]);
        exit;
    }

    // --------------------------------------------------------------

    try{
        if ($method === 'GET' && $segments[1] === 'brands') {
            $result = $controller->brands();
            http_response_code(200);
        } elseif ($method === 'GET' && $segments[1] === 'models') {
            $result = $controller->models($brandId);
            http_response_code(200);
        } elseif ($method === 'GET' && $id === null) {
            $result = $controller->index();
            http_response_code(200);
        } elseif ($method === 'GET' && $id !== null && $action === null) {
            $result = $controller->show($id);
            http_response_code(200);
        } elseif ($method === 'POST' && $segments[1] === 'vehicle' && $id === null) {
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
        } elseif ($method === 'POST' && $action === 'edit') {
            $result = $controller->edit($id, $body);
            http_response_code(200);
        } elseif ($method === 'DELETE' && $segments[1] === 'vehicle' && $id !== null) {
            $result = $controller->destroy($id);
            http_response_code(200);
        } elseif ($method === 'GET' && $action ==='history'){
            $result = $controller->history($id);
            http_response_code(200);
        } elseif ($method === 'POST' && $segments[1] === 'brands' && $id === null){
            $result = $controller->storeBrand($body['name']);
            http_response_code(200);
        } elseif ($method === 'POST' && $segments[1] === 'brands' && $id !== null){
            $result = $controller->updateBrand($id, $body['name']);
            http_response_code(200);
        } elseif ($method === 'DELETE' && $segments[1] === 'brands' && $id !== null){
            $result = $controller->destroyBrand($id);
            http_response_code(200);
        } elseif ($method === 'POST' && $segments[1] === 'models' && $id === null){
            $result = $controller->storeModel($body);
            http_response_code(200);
        } elseif ($method === 'POST' && $segments[1] === 'models' && $id !== null){
            $result = $controller->updateModel($id, $body['name']);
            http_response_code(200);
        } elseif ($method === 'DELETE' && $segments[1] === 'models' && $id !== null){
            $result = $controller->destroyModel($id);
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
    } catch(VehicleInvalidReferenceException $e) {
        http_response_code(400);
        $result = ['error' => $e->getMessage()];
    } catch (VehicleAvailableException $e) {
        http_response_code(409);
        $result = ['error' => $e->getMessage()];
    } catch (VehicleAlreadyExistException $e) {
        http_response_code(400);
        $result = ['error' => $e->getMessage()];
    } catch (BrandInUseException $e) {
        http_response_code(400);
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