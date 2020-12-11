<?php
namespace App\Controller\Players;

use Symfony\Component\HttpFoundation\JsonResponse;

use App\Controller\Common;
use App\Entity\Players as PlayersEntity;

class Main extends Common
{
    public function players(PlayersEntity $playersDB)
    {
        return new JsonResponse([
            'success' => true,
            'data' => $playersDB->players()
        ]);
    }
}
