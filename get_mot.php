<?php
header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$lettre = strtolower($_GET['lettre'] ?? '');
$taille = (string)($_GET['taille'] ?? '');

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

/* DEBUG TEMPORAIRE
echo json_encode($data);
exit;
*/

if (!isset($data[$taille])) {
    echo json_encode([
        "error" => "taille introuvable",
        "debug_taille" => $taille,
        "available" => array_keys($data)
    ]);
    exit;
}

if (!isset($data[$taille][$lettre])) {
    echo json_encode([
        "word" => null,
        "error" => "lettre introuvable",
        "debug_lettre" => $lettre,
        "available_letters" => array_keys($data[$taille])
    ]);
    exit;
}

$list = $data[$taille][$lettre];

if (empty($list)) {
    echo json_encode(["word" => null, "error" => "liste vide"]);
    exit;
}

$word = $list[array_rand($list)];

echo json_encode([
    "word" => $word
]);