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
            order by players.name'
        );
    }
}
