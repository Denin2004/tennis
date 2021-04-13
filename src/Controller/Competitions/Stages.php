<?php
namespace App\Controller\Competitions;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Controller\Common;
use App\Services\FormTransformer;
use App\Entity\Competitions\Stages as StagesEntity;
use App\Form\Competitions\Stages\Create;
use App\Form\Competitions\Stages\EditCompetitor;

class Stages extends Common
{
    public function stages(StagesEntity $stagesDB, $competition_id)
    {
        return new JsonResponse([
            'success' => true,
            'stages' => $stagesDB->stages(['competition_id' => $competition_id])
        ]);
    }

    public function addForm(FormTransformer $transformer, $competition_id)
    {
        $form = $this->createForm(Create::class, [
            'competition_id' => $competition_id
        ]);
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }

    public function create(Request $request, StagesEntity $stagesDB)
    {
        $formData = json_decode($request->getContent(), true);
        if ($formData == null) {
            return new JsonResponse([
                'error' => 'common.errors.formData'
            ]);
        }
        $form = $this->createForm(Create::class);
        $form->submit($formData);
        if (!$form->isValid()) {
            return new JsonResponse([
                'error' => $this->formErrors($form)
            ]);
        }

        $stagesDB->create($form->getData());
        if ($stagesDB->isError()) {
            return new JsonResponse([
                'success' => false,
                'error' => $stagesDB->getError()
            ]);
        }
        return $this->stages($stagesDB, $formData['competition_id']);
        return new JsonResponse([
            'success' => true,
            'id' => $formData['id'] == -1 ? $res['id'] : false
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

    public function view(StagesEntity $stagesDB, $id)
    {
        $view = $stagesDB->view([
            'id' => $id,
        ]);
        if ($stagesDB->isError()) {
            return new JsonResponse([
                'success' => false,
                'error' => $stagesDB->getError()
            ]);
        }
        if (!$view) {
            return new JsonResponse([
                'success' => false,
                'error' => 'competition.errors.stage_not_found'
            ]);
        }

        $games = $stagesDB->games([
            'id' => $id,
        ]);
        if ($stagesDB->isError()) {
            return new JsonResponse([
                'success' => false,
                'error' => $stagesDB->getError()
            ]);
        }
        if (!$view) {
            return new JsonResponse([
                'success' => false,
                'error' => 'competition.errors.stage_not_found'
            ]);
        }
        return new JsonResponse([
            'success' => true,
            'view' => $view,
            'games' => $games
        ]);
    }

    public function editCompetitor(FormTransformer $transformer, $stage_id, $competitor_id)
    {
        $form = $this->createForm(
            EditCompetitor::class,
            [
                'competitor_id' => $competitor_id,
                'stage_id' => $stage_id
            ],
            [
                'stage_id' => $stage_id
            ]
        );
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }

    public function postCompetitor(Request $request, StagesEntity $stagesDB)
    {
        $formData = json_decode($request->getContent(), true);
        if ($formData == null) {
            return new JsonResponse([
                'error' => 'common.errors.formData'
            ]);
        }
        $form = $this->createForm(EditCompetitor::class);
        $form->submit($formData);
        if (!$form->isValid()) {
            return new JsonResponse([
                'error' => $this->formErrors($form)
            ]);
        }
        $stagesDB->postCompetitor($form->getData());
        return new JsonResponse([
            'success' => true
        ]);
    }
}
