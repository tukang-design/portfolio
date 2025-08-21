<?php
// Simple PHP script to send emails from contact form
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Extract data
$to = 'studio@tukang.design';
$name = htmlspecialchars($input['name'] ?? '');
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$service = htmlspecialchars($input['service'] ?? 'General Inquiry');
$message = htmlspecialchars($input['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Email subject and content
$subject = "New Website Inquiry from " . $name;
$email_content = "
New inquiry received from your website:

Name: $name
Email: $email
Service Requested: $service

Message:
$message

---
This email was sent from your website contact form.
Reply directly to: $email
";

// Email headers
$headers = "From: website@tukang.design\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
if (mail($to, $subject, $email_content, $headers)) {
    echo json_encode([
        'success' => true, 
        'message' => 'Email sent successfully to studio@tukang.design'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send email'
    ]);
}
?>
