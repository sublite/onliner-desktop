<?php

namespace Sublite\Onliner;

class Users
{
    private $DBH;
    private $ownerVKUID;

    public function __construct($ownerVKUID)
    {
        $dotenv = new \Dotenv\Dotenv(__DIR__."/../../");
        $dotenv->load();

        $this->ownerVKUID = $ownerVKUID;
        try {
            $DBH = new \PDO("mysql:host=".$_ENV['DB_host'].";dbname=".$_ENV['DB_name'], $_ENV['DB_user'], $_ENV['DB_password']);
            // this attribute only in dev mode
            $DBH->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            $DBH->exec("set names utf8");
            $this->DBH = $DBH;
        } catch (\PDOException $e) {
            echo "DB connection error";
        }
    }

    private function isUIDexist($userIDforMonitoring)
    {
        $STH = $this->DBH->prepare("SELECT object_uid FROM onliner_owners_uids WHERE vk_uid = ? AND object_uid = ?");
        $STH->bindParam(1, $this->ownerVKUID);
        $STH->bindParam(2, $userIDforMonitoring);
        $STH->setFetchMode(\PDO::FETCH_ASSOC);
        $STH->execute();
        $res = $STH->fetchAll();
        return $res ? true : false;
    }

    public function add($userIDforMonitoring)
    {
        try {
            $STH = $this->DBH->prepare("INSERT IGNORE INTO onliner_objects_uids (uid, date_creation) values (:uid, :date_creation)");
            $STH->bindParam(':uid', $userIDforMonitoring);
            $STH->bindParam(':date_creation', time());
            $res = $STH->execute();
        } catch (\PDOException $e) {
            echo "DB error in add():1 method";
        }

        if (!$this->isUIDexist($userIDforMonitoring)) {
            try {
                $STH = $this->DBH->prepare("INSERT INTO onliner_owners_uids (object_uid, vk_uid) values (:object_uid, :vk_uid)");
                $STH->bindParam(':object_uid', $userIDforMonitoring);
                $STH->bindParam(':vk_uid', $this->ownerVKUID);
                $res = $STH->execute();
                return $res ? true : false;
            } catch (\PDOException $e) {
                echo "DB error in add():2 method";
            }
        } else {
            return true;
        }
    }

    public function remove($userID)
    {
        try {
            $STH = $this->DBH->prepare("DELETE FROM onliner_owners_uids WHERE object_uid = ? AND vk_uid = ? LIMIT 1");
            $STH->bindParam(1, $userID);
            $STH->bindParam(2, $this->ownerVKUID);
            $res = $STH->execute();
            return $res ? true : false;
        } catch (\PDOException $e) {
            echo "DB error in remove() method";
        }
    }

    private function format($history)
    {
        $func = function ($formattedHistory, $item) {
            $formattedHistory[] = array($item["enter_time"], $item["logout_time"], $item["from_mobile"]);
            return $formattedHistory;
        };
        return array_reduce($history, $func);
    }

    public function getAllUsersStats($countOfLastHours)
    {
        try {
            $STH = $this->DBH->prepare("SELECT object_uid FROM onliner_owners_uids WHERE vk_uid = ? LIMIT 100");
            $STH->bindParam(1, $this->ownerVKUID);
            $STH->setFetchMode(\PDO::FETCH_ASSOC);
            $STH->execute();
            $stats = array();
            while ($row = $STH->fetch()) {
                $objUID = $row['object_uid'];
                    $STH_ = $this->DBH->prepare("SELECT uid, enter_time, logout_time, from_mobile FROM onliner_hour WHERE uid = ? AND (`enter_time` > DATE_SUB(CURRENT_DATE, INTERVAL ".(int)$countOfLastHours." HOUR)) ORDER BY enter_time DESC");
                    $STH_->bindParam(1, $objUID);
                    $STH_->setFetchMode(\PDO::FETCH_ASSOC);
                    $STH_->execute();
                    $res = $STH_->fetchAll();
                    $stats[$objUID] = $this->format($res);
            }
            return $stats;
        } catch (\PDOException $e) {
            echo "DB error in getAllUsersStats() method";
        }
    }
}
