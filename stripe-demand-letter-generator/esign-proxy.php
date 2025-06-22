<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// eSignatures.com API configuration
$apiToken = '1807161e-d29d-4ace-9b87-864e25c70b05';
$apiUrl = 'https://esignatures.com/api/templates';

// Prepare the API request
$postData = json_encode($input);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postData,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiToken,
        'Accept: application/json'
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . $error]);
    exit();
}

// If templates endpoint fails, try contracts endpoint
if ($httpCode !== 200) {
    $contractsUrl = 'https://esignatures.com/api/contracts';
    
    // Modify data structure for contracts endpoint
    $contractData = [
        'test' => $input['test'] ?? 'yes',
        'title' => $input['template']['title'] ?? 'Document',
        'document_content' => $input['template']['content'] ?? '',
        'signers' => $input['signers'] ?? []
    ];
    
    $contractPostData = json_encode($contractData);
    
    $ch2 = curl_init();
    curl_setopt_array($ch2, [
        CURLOPT_URL => $contractsUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $contractPostData,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiToken,
            'Accept: application/json'
        ],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch2);
    $httpCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    $error = curl_error($ch2);
    curl_close($ch2);
    
    if ($error) {
        http_response_code(500);
        echo json_encode(['error' => 'cURL error on contracts endpoint: ' . $error]);
        exit();
    }
}

// Return the API response
http_response_code($httpCode);
echo $response;
?>