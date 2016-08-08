<?php

namespace Sublite\Onliner;

use Sublite\Onliner\CommonLib;

ini_set('display_errors', 1);

require_once("vendor/autoload.php");

$method = $_GET['method'];
$uid = (int)$_GET['uid'];

$token = $_COOKIE['access_token'];
$ownerVKUID = CommonLib\getUIDbyToken($token);
if (!$ownerVKUID) {
    die('auth error');
}

$users = new Users($ownerVKUID);
if ($method == 'getStats') {
    $COUNT_OF_HOURS_FOR_SELECTION = 24;
    $history = $users->getAllUsersStats($COUNT_OF_HOURS_FOR_SELECTION);
    echo json_encode($history);
} else if ($method == 'add') {
    if (isUIDValid($uid)) {
        echo $users->add($uid);
    } else {
        echo "incorrect uid";
    }
} else if ($method == 'remove') {
    if (isUIDValid($uid)) {
        echo $users->remove($uid);
    } else {
        echo "incorrect uid";
    }
} else {
    echo "unknow method";
}
