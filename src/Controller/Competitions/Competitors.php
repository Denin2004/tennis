<?php
namespace App\Controller\Competitions;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Controller\Common;
use App\Services\FormTransformer;

use App\Entity\Competitions\Competitors as CompetitorsEntity;
use App\Form\Competitions\Competitor;

class Competitors extends Common
{
    public function competitors(CompetitorsEntity $competitorsDB, $competition_id)
    {
        return new JsonResponse([
            'success' => true,
            'data' => $competitorsDB->competitors(['competition_id' => $competition_id])
        ]);
    }

    public function form(FormTransformer $transformer, CompetitorsEntity $competitorsDB, $id)
    {
        $court = [
            'id' => $id,
        ];
        if ($id != -1) {
            $court = $competitorsDB->competitor($court);
            if (!$court) {
                return new JsonResponse([
                    'error' => 'competition.errors.competitor_not_found'
                ]);
            }
        }
        $form = $this->createForm(Competitor::class, $court);
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }

    public function post(Request $request, CompetitorsEntity $competitorsDB)
    {
        $formData = json_decode($request->getContent(), true);
        if ($formData == null) {
            return new JsonResponse([
                'error' => 'common.errors.formData'
            ]);
        }
        $form = $this->createForm(Court::class);
        $form->submit($formData);
        if (!$form->isValid()) {
            return new JsonResponse([
                'error' => $this->formErrors($form)
            ]);
        }

        $res = $competitorsDB->post($form->getData());
        return new JsonResponse([
            'success' => true,
            'id' => $formData['id'] == -1 ? $res['id'] : false
        ]);
    }

    public function delete(CompetitorsEntity $competitorsDB, $id)
    {
        $competitorsDB->delete([
            'id' => $id,
        ]);
        return new JsonResponse([
            'success' => true
        ]);
    }
}
