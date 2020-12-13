<?php
namespace App\Controller\Players;

use Symfony\Component\HttpFoundation\JsonResponse;

use App\Controller\Common;
use App\Services\FormTransformer;

use App\Entity\Players as PlayersEntity;
use App\Form\Player;

class Main extends Common
{
    public function players(PlayersEntity $playersDB)
    {
        return new JsonResponse([
            'success' => true,
            'data' => $playersDB->players()
        ]);
    }

    public function form(FormTransformer $transformer, PlayersEntity $playersDB, $id)
    {
        $player = [
            'id' => $id,
        ];
        if ($id != -1) {
            $player = $playersDB->player(id);
            if (!$player) {
                return new JsonResponse([
                    'error' => 'player.errors.not_found'
                ]);
            }
        }
        $form = $this->createForm(Player::class, $player);
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }
}
