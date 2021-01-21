<?php
namespace App\Form\Competitions\Stages;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

use App\Services\Stages;

class Create extends AbstractType
{

    protected $stages;

    public function __construct(Stages $stages)
    {
        $this->stages = $stages;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('competition_id', HiddenType::class)
            ->add('name', TextType::class)
            ->add(
                'type',
                ChoiceType::class,
                [
                    'choices' => $this->stages->choices(),
                    'expanded' => false,
                    'multiple' => false,
                    'data' => 'group'
                ]
            );
        $this->stages->buildForm($builder, $options, 'all');
    }
}
