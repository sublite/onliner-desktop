<?php

namespace Sublite\Onliner;

use Sublite\Onliner\CommonLib;

ini_set('display_errors', 1);

require_once("vendor/autoload.php");

$dotenv = new \Dotenv\Dotenv(__DIR__);
$dotenv->load();

$code = $_GET['code'];
$SERVER_URL = "http://".$_SERVER['HTTP_HOST'];

if ($code) {
    $clientID = $_ENV['app_clientID'];
    $clientSecret = $_ENV['app_clientSecret'];
    $redirectURI = $SERVER_URL."/auth.php";
    $res = CommonLib\getSslPage("https://oauth.vk.com/access_token?client_id=".$clientID."&client_secret=".$clientSecret."&redirect_uri=".$redirectURI."&code=".$code);
    $decoded_response = json_decode($res);
    $token = $decoded_response->access_token;
    setcookie("access_token", $token);
    header('Location: '.$SERVER_URL);
}
