<?php

namespace Sublite\Onliner\CommonLib;

function isUIDValid($uid)
{
    if (is_int($uid) && $uid > 0) {
        return true;
    } else {
        return false;
    }
}

function getUIDbyToken($token)
{
    $response = file_get_contents('https://api.vk.com/method/users.get?access_token='.$token);
    $responseDecoded = json_decode($response);
    $uid = $responseDecoded->response[0]->uid;
    if ($uid) {
        return $uid;
    } else {
        return false;
    }
}

function getSslPage($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_REFERER, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}
