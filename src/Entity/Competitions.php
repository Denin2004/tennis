<?php
namespace App\Entity;

use App\Entity\Entity;

class Competitions extends Entity
{
    public function competitions()
    {
        return $this->provider->db()->fetchAll(
            'select competitions.id, to_char(competitions.from::timestamp, :format) as "from",
                to_char(competitions.to::timestamp, :format) as "to", competitions.type, courts.name court
                from competitions. competitions
            left join competitions.courts courts on(courts.id=competitions.court_id)
            order by competitions.from desc',
            [
                'format' => $this->provider->dateTimeFormat()
            ]
        );
    }

    public function post($params)
    {
        $params['format'] = $this->provider->dateTimeFormat();
        $params['from'] = $params['period'][0];
        $params['to'] = $params['period'][1];
        if ($params['id'] == -1) {
            return $this->provider->db()->fetchAll('insert into competitions.competitions (court_id, type, "from", "to")
                values(:court_id, :type, to_timestamp(:from, :format),
                to_timestamp(:to, :format)) returning id', $params)[0];
        } else {
            $this->provider->db()->executeQuery('update competitions.competitions set court_id=:court_id,
                type=:type "from"=to_timestamp(:from, :format), "to"=to_timestamp(:to, :format) where id=:id', $params);
        }
    }

    public function competition($params)
    {
        $params['format'] = $this->provider->dateTimeFormat();
        $res = $this->provider->db()->fetchAll(
            'select competitions.id, to_char(competitions.from::timestamp, :format) as "from",
                to_char(competitions.to::timestamp, :format) as "to", competitions.type, competitions.court_id
                from competitions.competitions
            where competitions.id=:id',
            $params
        );
        if (isset($res[0])) {
            $res[0]['period'] = [
                '0' => $res[0]['from'],
                '1' => $res[0]['to']
            ];
            return $res[0];
        }
        return false;
    }

    public function delete($params)
    {
        $this->provider->db()->executeQuery('update players.players set id=-1, del=true where id=:id', $params);
    }
}
