<?php
header('Content-Type: text/plain; charset=utf-8');

$key = '26aec0e3f0ccf89579f01c3e708ac9eb';
$host = 'www.aw-verwaltung.de';
$keyLocation = 'https://www.aw-verwaltung.de/26aec0e3f0ccf89579f01c3e708ac9eb.txt';
$sitemapFile = __DIR__ . '/sitemap.xml';
$rateFile = sys_get_temp_dir() . '/aw-indexnow-last-run.txt';
$minInterval = 600; // 10 minutes

if (!isset($_GET['run']) || $_GET['run'] !== '1') {
    http_response_code(400);
    echo "IndexNow endpoint ready. Call with ?run=1 after a deployment.\n";
    exit;
}

if (file_exists($rateFile)) {
    $lastRun = (int) @file_get_contents($rateFile);
    if ($lastRun > 0 && (time() - $lastRun) < $minInterval) {
        http_response_code(429);
        echo "IndexNow was already triggered recently. Please wait a few minutes.\n";
        exit;
    }
}

if (!is_file($sitemapFile)) {
    http_response_code(500);
    echo "sitemap.xml not found.\n";
    exit;
}

$xml = @simplexml_load_file($sitemapFile);
if ($xml === false) {
    http_response_code(500);
    echo "Could not read sitemap.xml.\n";
    exit;
}

$urls = [];
foreach ($xml->url as $url) {
    $loc = trim((string) $url->loc);
    if ($loc === '') continue;
    $parts = parse_url($loc);
    if (!isset($parts['host']) || strtolower($parts['host']) !== $host) continue;
    $urls[] = $loc;
}

$urls = array_values(array_unique($urls));
if (!$urls) {
    http_response_code(500);
    echo "No valid URLs found in sitemap.xml.\n";
    exit;
}

$payload = json_encode([
    'host' => $host,
    'key' => $key,
    'keyLocation' => $keyLocation,
    'urlList' => $urls,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$endpoint = 'https://api.indexnow.org/indexnow';
$status = 0;
$response = '';

if (function_exists('curl_init')) {
    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json; charset=utf-8'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_USERAGENT => 'AW-Verwaltung-IndexNow/1.0',
    ]);
    $response = (string) curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
} else {
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json; charset=utf-8\r\nUser-Agent: AW-Verwaltung-IndexNow/1.0\r\n",
            'content' => $payload,
            'timeout' => 15,
            'ignore_errors' => true,
        ],
    ]);
    $response = (string) @file_get_contents($endpoint, false, $context);
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) {
        $status = (int) $m[1];
    }
}

if ($status === 200 || $status === 202) {
    @file_put_contents($rateFile, (string) time());
    echo "IndexNow submission successful.\n";
    echo "Submitted URLs: " . count($urls) . "\n";
    exit;
}

http_response_code($status >= 400 ? $status : 502);
echo "IndexNow submission failed. HTTP status: " . $status . "\n";
if ($response !== '') echo $response . "\n";
