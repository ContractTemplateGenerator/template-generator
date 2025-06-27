<?php
// Simple PHP proxy for eSignatures.com API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'create_template') {
        // Step 1: Create template
        $data = [
            'name' => 'Security Deposit Demand Letter',
            'content' => $input['documentContent'],
            'roles' => [
                [
                    'name' => 'Tenant',
                    'order' => 1
                ]
            ]
        ];
        
        $url = "https://esignatures.com/api/templates?token=" . $TOKEN;
        
    } else if ($action === 'create_contract') {
        // Step 2: Create contract
        $data = [
            'template_id' => $input['template_id'],
            'signers' => [
                [
                    'name' => $input['signer_name'],
                    'email' => $input['signer_email']
                ]
            ]
        ];
        
        $url = "https://esignatures.com/api/contracts?token=" . $TOKEN;
        
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action specified']);
        exit;
    }
    
    // Make API call
    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data),
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        throw new Exception('Failed to connect to eSignatures.com API');
    }
    
    $response = json_decode($result, true);
    
    if ($action === 'create_template') {
        echo json_encode([
            'success' => true,
            'template_id' => $response['template_id'],
            'message' => 'Template created successfully'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'contract_id' => $response['contract_id'],
            'signing_url' => $response['signing_url'],
            'message' => 'Contract created successfully'
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'eSignature service error',
        'message' => $e->getMessage()
    ]);
}
?>