<?php
namespace App\Entity\Competitions;

use App\Services\DbProvider;
use App\Entity\Entity;
use App\Services\Stages as StagesService;

class Stages extends Entity
{

    protected $stages;

    public function __construct(DbProvider $provider, StagesService $stages)
    {
        parent::__construct($provider);
        $this->stages = $stages;
    }

    public function stages($params)
    {
        return $this->provider->fetchAll(
            'select stages.id, stages.name, stages.type
            from competitions.stages stages
            where (stages.competition_id=:competition_id)',
            $params
        );
    }

    public function create($params)
    {
        $params['data'] = $this->stages->configDB($params);
        $this->provider->executeQuery('insert into competitions.stages (competition_id, name, type, data)values(:competition_id, :name, :type, :data)', $params)[0];
    }

    public function post($params)
    {
         $this->provider->executeQuery('update competitions.competitors set player1_id=:player1, player2_id=:player2  where id=:id', $params);
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
            return $res[0];
        }
        if (isset($res[0])) {
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
