<?php
namespace App\Form\Competitions;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use App\Entity\Courts;

class Competitor extends AbstractType
{

    private $courts;

    public function __construct(Courts $courts)
    {
        $this->courts = $courts;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('competition_id', HiddenType::class);
    }
}
