<?php
namespace App\Entity;

use App\Entity\Entity;

class Players extends Entity
{
    public function players()
    {
        return $this->provider->db()->fetchAll(
            'select players.id, players.name, players.phone
            from players.players players
            where players.del = false
            order by players.name'
        );
    }

    public function post($params)
    {
        if ($params['id'] == -1) {
            $this->provider->db()->executeQuery('insert into players.players (name, phone)values(:name, :phone)', $params);
        } else {
            $this->provider->db()->executeQuery('update players.players set name=:name, phone=:phone where id=:id', $params);
        }
    }

    public function player($params)
    {
        $res = $this->provider->db()->fetchAll(
            'select players.id, players.name, players.phone
            from players.players players where players.id=:id',
            $params
        );
        return isset($res[0]) ? $res[0] : false;
    }

    public function delete($params)
    {
        $this->provider->db()->executeQuery('update players.players set id=-1, del=true where id=:id', $params);
    }
}
