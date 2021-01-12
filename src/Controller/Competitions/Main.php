<?php
namespace App\Controller\Competitions;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Controller\Common;
use App\Services\FormTransformer;

use App\Entity\Competitions\Main as CompetitionsEntity;
use App\Form\Competitions\Add;

class Main extends Common
{
    public function competitions(CompetitionsEntity $competitionsDB)
    {
        return new JsonResponse([
            'success' => true,
            'data' => $competitionsDB->competitions()
        ]);
    }

    public function edit(FormTransformer $transformer, CompetitionsEntity $competitionsDB, $id)
    {
        $competition = $competitionsDB->competition(['id' => $id]);
        if (!$competition) {
            return new JsonResponse([
                'error' => 'player.errors.not_found'
            ]);
        }
        $form = $this->createForm(Add::class, $competition);
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }

    public function addForm(FormTransformer $transformer)
    {
        $form = $this->createForm(Add::class, ['id' => -1]);
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }

    public function post(Request $request, CompetitionsEntity $competitionsDB)
    {
        $formData = json_decode($request->getContent(), true);
        if ($formData == null) {
            return new JsonResponse([
                'error' => 'common.errors.formData'
            ]);
        }
        $form = $this->createForm(Add::class);
        $form->submit($formData);
        if (!$form->isValid()) {
            return new JsonResponse([
                'error' => $this->formErrors($form)
            ]);
        }
        $res = $competitionsDB->post($form->getData());
        return new JsonResponse([
            'success' => true,
            'id' => $formData['id'] == -1 ? $res['id'] : false
        ]);
    }

    public function delete(CompetitionsEntity $competitionsDB, $id)
    {
        $competition = [
            'id' => $id,
        ];
        $competitionsDB->delete($competition);
        return new JsonResponse([
            'success' => true
        ]);
    }
}
