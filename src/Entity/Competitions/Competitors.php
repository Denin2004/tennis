<?php
namespace App\Entity;

use App\Entity\Entity;

class Competitors extends Entity
{
    public function competitors($params)
    {
        return $this->provider->db()->fetchAll(
            'select competitors.id, competitions.type,
                competitors.player1_id, player1.name player1,
                competitors.player2_id, player1.name player2
            from competitions.competitors competitors
                left join competitions.competitions competitions on (competitions.id=competitors.competition_id)
                left join players.players player1 on (player1.id=competitors.player1_id)
                left join players.players player2 on (player2.id=competitors.player2_id)
            where (competitors.competition_id=:competition_id)',
            $params
        );
    }

    public function post($params)
    {
        if ($params['id'] == -1) {
            return $this->provider->db()->fetchAll('insert into competitions.courts (name, address)values(:name, :address) returning id', $params)[0];
        } else {
            $this->provider->db()->executeQuery('update competitions.courts set name=:name, address=:address where id=:id', $params);
        }
    }

    public function competitor($params)
    {
        $res = $this->provider->db()->fetchAll(
            'select competitors.id, competitions.type,
                competitors.player1_id, player1.name player1,
                competitors.player2_id, player1.name player2
            from competitions.competitors competitors
                left join competitions.competitions competitions on (competitions.id=competitors.competition_id)
                left join players.players player1 on (player1.id=competitors.player1_id)
                left join players.players player2 on (player2.id=competitors.player2_id)
            where (competitors.id=:id)',
            $params
        );
        return isset($res[0]) ? $res[0] : false;
    }

    public function delete($params)
    {
        $this->provider->db()->executeQuery('delete from competitions.competitors where id=:id', $params);
    }
}
