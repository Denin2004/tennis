<?php
namespace App\Entity\Competitions;

use App\Entity\Entity;

class Competitors extends Entity
{
    public function competitors($params)
    {
        return $this->provider->fetchAll(
            'select competitors.id, competitions.type,
                competitors.player1_id, player1.name player1,
                competitors.player2_id, player2.name player2,
                competitions.id as competition_id
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
        $params['player1'] = $params['player1']['value'];
        $params['player2'] = $params['player2']['value'];
        if ($params['id'] == -1) {
            return $this->provider->fetchAll('insert into competitions.competitors (competition_id, player1_id, player2_id)values(:competition_id, :player1, :player2) returning id', $params)[0];
        } else {
            $this->provider->executeQuery('update competitions.competitors set player1_id=:player1, player2_id=:player2  where id=:id', $params);
        }
    }

    public function competitor($params)
    {
        $res = $this->provider->fetchAll(
            'select competitors.id, competitions.type as competition_type,
                competitors.player1_id, player1.name player1,
                competitors.player2_id, player2.name player2,
                competitions.id as competition_id
            from competitions.competitors competitors
                left join competitions.competitions competitions on (competitions.id=competitors.competition_id)
                left join players.players player1 on (player1.id=competitors.player1_id)
                left join players.players player2 on (player2.id=competitors.player2_id)
            where (competitors.id=:id)',
            $params
        );
        if (isset($res[0])) {
            $res[0]['player1'] = [
                'search' => $res[0]['player1'],
                'value' => $res[0]['player1_id']
            ];
            $res[0]['player2'] = [
                'search' => $res[0]['player2'],
                'value' => $res[0]['player2_id']
            ];
            return $res[0];
        }
        return false;
    }

    public function delete($params)
    {
        $this->provider->executeQuery('delete from competitions.competitors where id=:id', $params);
    }
}
