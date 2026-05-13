<?php
header('Content-Type: application/json; charset=utf-8');

$mot = strtolower($_GET['mot'] ?? '');

$file = "mots.json";

if (!file_exists($file)) {
    echo json_encode(["error" => "mots.json introuvable"]);
    exit;
}

$data = json_decode(file_get_contents($file), true);

if (!$data) {
    echo json_encode(["error" => "JSON invalide"]);
    exit;
}

$exists = false;

// 🔍 on parcourt tout le JSON
foreach ($data as $length => $letters) {
    foreach ($letters as $letter => $words) {
        if (in_array($mot, $words)) {
            $exists = true;
            break 2;
        }
    }
}

echo json_encode([
    "word" => $mot,
    "exists" => $exists
]);