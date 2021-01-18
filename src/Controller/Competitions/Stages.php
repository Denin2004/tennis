<?php
namespace App\Controller\Competitions;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Controller\Common;
use App\Services\FormTransformer;

use App\Entity\Competitions\Stages as StagesEntity;

class Stages extends Common
{
    public function stages(StagesEntity $stagesDB, $competition_id)
    {
        return new JsonResponse([
            'success' => true,
            'data' => $stagesDB->stages(['competition_id' => $competition_id])
        ]);
    }

    public function form(FormTransformer $transformer, StagesEntity $stagesDB, CompetitionsEntity $competitionsDB, $competition_id, $id)
    {
        $competitor = [
            'id' => $id,
            'competition_id' => $competition_id
        ];
        if ($id != -1) {
            $competitor = $stagesDB->competitor($competitor);
            if (!$competitor) {
                return new JsonResponse([
                    'error' => 'competition.errors.competitor_not_found'
                ]);
            }
        } else {
            $competitor['competition_type'] = $competitionsDB->type($competition_id);
        }
        $form = $this->createForm(Competitor::class, $competitor);
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }

    public function post(Request $request, StagesEntity $stagesDB)
    {
        $formData = json_decode($request->getContent(), true);
        if ($formData == null) {
            return new JsonResponse([
                'error' => 'common.errors.formData'
            ]);
        }
        $form = $this->createForm(Competitor::class);
        $form->submit($formData);
        if (!$form->isValid()) {
            return new JsonResponse([
                'error' => $this->formErrors($form)
            ]);
        }

        $res = $stagesDB->post($form->getData());
        if ($stagesDB->isError()) {
            return new JsonResponse([
                'success' => false,
                'error' => $stagesDB->getError()
            ]);
        }
        return new JsonResponse([
            'success' => true,
            'id' => $formData['id'] == -1 ? $res['id'] : false
        ]);
    }

    public function delete(StagesEntity $stagesDB, $id)
    {
        $stagesDB->delete([
            'id' => $id,
        ]);
        if ($stagesDB->isError()) {
            return new JsonResponse([
                'success' => false,
                'error' => $stagesDB->getError()
            ]);
        }
        return new JsonResponse([
            'success' => true
        ]);
    }
}
