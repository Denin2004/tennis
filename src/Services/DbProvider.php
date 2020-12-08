<?php
namespace App\Services;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\DBAL\Driver\Connection;

class DbProvider
{
    protected $db;
    protected $user;
    protected $dateFormat;
    protected $timeFormat;
    protected $token;

    public function __construct(Connection $db, TokenStorageInterface $token, ContainerInterface $container)
    {
        $this->db = $db;
        $this->token = $token;
        $this->dateFormat = $container->getParameter('db_date_format');
        $this->timeFormat = $container->getParameter('db_time_format');
    }

    public function db()
    {
        return $this->db;
    }

    public function user()
    {
        return $this->token->getToken()->getUser();
    }

    public function dateFormat()
    {
        return $this->dateFormat;
    }

    public function dateTimeFormat()
    {
        return $this->dateFormat.' '.$this->timeFormat;
    }

    public function timeFormat()
    {
        return $this->timeFormat;
    }

    public function executeQuery($sql, $params = [])
    {
        $res = 'Ok';
        try {
            $this->db->executeQuery($sql, $params);
        } catch (\Doctrine\DBAL\DBALException $ex) {
            $err = explode('ERROR:', $ex->getPrevious()->getMessage());
            $res = str_replace(' ', '', explode("\n", $err[count($err)-1])[0]);
        }
        return $res;
    }
}
