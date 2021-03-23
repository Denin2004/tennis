<?php
namespace App\Controller\Competitions;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Controller\Common;
use App\Services\FormTransformer;

use App\Entity\Competitions\Competitors as CompetitorsEntity;
use App\Entity\Competitions\Main as CompetitionsEntity;
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

    public function form(FormTransformer $transformer, CompetitorsEntity $competitorsDB, CompetitionsEntity $competitionsDB, $competition_id, $id)
    {
        $competitor = [
            'id' => $id,
            'competition_id' => $competition_id
        ];
        if ($id != -1) {
            $competitor = $competitorsDB->competitor($competitor);
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

    public function post(Request $request, CompetitorsEntity $competitorsDB)
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
        $res = $competitorsDB->post($form->getData());
        if ($competitorsDB->isError()) {
            return new JsonResponse([
                'success' => false,
                'error' => $competitorsDB->getError()
            ]);
        }
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
        if ($competitorsDB->isError()) {
            return new JsonResponse([
                'success' => false,
                'error' => $competitorsDB->getError()
            ]);
        }
        return new JsonResponse([
            'success' => true
        ]);
    }
}
