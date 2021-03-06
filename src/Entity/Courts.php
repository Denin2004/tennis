<?php
namespace App\Entity;

use App\Entity\Entity;

class Courts extends Entity
{
    public function courts()
    {
        return $this->provider->fetchAll(
            'select courts.id, courts.name, courts.address
            from competitions.courts courts
            where courts.del = false
            order by courts.name'
        );
    }

    public function post($params)
    {
        if ($params['id'] == -1) {
            return $this->provider->fetchAll('insert into competitions.courts (name, address)values(:name, :address) returning id', $params)[0];
        } else {
            $this->provider->executeQuery('update competitions.courts set name=:name, address=:address where id=:id', $params);
        }
    }

    public function court($params)
    {
        $res = $this->provider->fetchAll(
            'select courts.id, courts.name, courts.address
            from competitions.courts courts where courts.id=:id',
            $params
        );
        return isset($res[0]) ? $res[0] : false;
    }

    public function delete($params)
    {
        $this->provider->executeQuery('update competitions.courts set id=-1, del=true where id=:id', $params);
    }

    public function choices()
    {
        $courts = $this->provider->fetchAll(
            'select courts.id, courts.name
                from competitions.courts courts'
        );
        $res = [];
        foreach ($courts as $court) {
            $res[$court['name']] = $court['id'];
        }
        return $res;
    }
}
