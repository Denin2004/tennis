<?php
namespace App\Controller\Players;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

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
            $player = $playersDB->player($player);
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

    public function post(Request $request, PlayersEntity $playersDB)
    {
        $formData = json_decode($request->getContent(), true);
        if ($formData == null) {
            return new JsonResponse([
                'error' => 'common.errors.formData'
            ]);
        }
        $form = $this->createForm(Player::class);
        $form->submit($formData);
        if (!$form->isValid()) {
            return new JsonResponse([
                'error' => $this->formErrors($form)
            ]);
        }

        $playersDB->post($form->getData());
        return new JsonResponse([
            'success' => true
        ]);
    }

    public function delete(PlayersEntity $playersDB, $id)
    {
        $player = [
            'id' => $id,
        ];
        $playersDB->delete($player);
        return new JsonResponse([
            'success' => true
        ]);
    }

    public function search(PlayersEntity $playersDB, $text)
    {
        $res = $playersDB->search(urldecode($text));
        return new JsonResponse([
            'success' => true,
            'data' => $res
        ]);
    }
}
