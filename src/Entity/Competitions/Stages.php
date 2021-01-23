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

    public function view($params)
    {
        $res = $this->provider->fetchAll(
            'select stages.id, stages.name, stages.type, stages.data
            from competitions.stages stages
            where (stages.id=:id)',
            $params
        );
        return isset($res[0]) ? $res[0] : false;
    }

    public function games($params)
    {
        $stage = $this->view($params);
        if (!$stage) {
            return $stage;
        }
        return $this->provider->fetchAll(
            'select * from stage_'.$stage['type'].'.games(:id)',
            $params
        );
    }
    
    public function post($params)
    {
         $this->provider->executeQuery('update competitions.competitors set player1_id=:player1, player2_id=:player2  where id=:id', $params);
    }

    public function delete($params)
    {
        $this->provider->executeQuery('delete from competitions.competitors where id=:id', $params);
    }

}
