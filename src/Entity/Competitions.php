<?php
namespace App\Entity;

use App\Entity\Entity;

class Competitions extends Entity
{
    public function competitions()
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
        $params['format'] = $this->provider->dateTimeFormat();
        $params['from'] = $params['period'][0];
        $params['to'] = $params['period'][1];
        if ($params['id'] == -1) {
            return $this->provider->db()->fetchAll('insert into competitions.competitions (court_id, type, "from", "to")
                values(:court_id, :type, to_date(:from, :format), to_date(:to, :format)) returning id', $params)[0];
        } else {
            $this->provider->db()->executeQuery('update competitions.competitions set court_id=:court_id,
                type=:type "from"=to_date(:from, :format), "to"=to_date(:to, :format) where id=:id', $params);
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
