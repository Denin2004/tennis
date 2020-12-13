<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class Common extends AbstractController
{
    protected function formatNumber($number)
    {
        return number_format($number, 0, '.', ' ');
    }

    protected function formErrors($form)
    {
        $res = '';
        foreach ($form->getErrors(true) as $error) {
            $res.= $error->getMessage().' ';
        }
        return $res;
    }
}
