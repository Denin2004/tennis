<?php
namespace App\Controller\Courts;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Controller\Common;
use App\Services\FormTransformer;

use App\Entity\Courts as CourtsEntity;
use App\Form\Court;

class Main extends Common
{
    public function courts(CourtsEntity $courtsDB)
    {
        return new JsonResponse([
            'success' => true,
            'data' => $courtsDB->courts()
        ]);
    }

    public function form(FormTransformer $transformer, CourtsEntity $courtsDB, $id)
    {
        $court = [
            'id' => $id,
        ];
        if ($id != -1) {
            $court = $courtsDB->court($court);
            if (!$court) {
                return new JsonResponse([
                    'error' => 'court.errors.not_found'
                ]);
            }
        }
        $form = $this->createForm(Court::class, $court);
        return new JsonResponse([
            'success' => true,
            'form' => $transformer->transform($form->createView())
        ]);
    }

    public function post(Request $request, CourtsEntity $courtsDB)
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

        $res = $courtsDB->post($form->getData());
        return new JsonResponse([
            'success' => true,
            'id' => $formData['id'] == -1 ? $res['id'] : false
        ]);
    }

    public function delete(CourtsEntity $courtsDB, $id)
    {
        $court = [
            'id' => $id,
        ];
        $courtsDB->delete($court);
        return new JsonResponse([
            'success' => true
        ]);
    }
}
