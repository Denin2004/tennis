<?php
namespace App\Controller;

use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use App\Services\DbProvider;

class Common extends AbstractController
{
    protected $translator;

    public function __construct(TranslatorInterface $tr)
    {
        $this->translator = $tr;
    }

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
