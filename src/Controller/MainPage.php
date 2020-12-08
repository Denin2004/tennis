<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class MainPage extends AbstractController
{
    /**
     * @Route("/app/{reactRouting}", name="default", defaults={"reactRouting": null})
     */
    public function index()
    {
        return $this->render(
            'main.html.twig',
            [
                'js_date_format' => $this->getParameter('js_date_format'),
                'js_time_format' => $this->getParameter('js_time_format')
            ]
        );
    }
}
