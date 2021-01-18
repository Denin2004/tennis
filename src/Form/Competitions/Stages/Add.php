<?php
namespace App\Form\Competitions\Stages;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

use App\Form\Competitions\Stages\Config;

class Add extends Config
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('competition_id', HiddenType::class)
            ->add('name', TextType::class)
            ->add(
                'type',
                ChoiceType::class,
                [
                    'choices' => $this->stageTypes,
                    'expanded' => false,
                    'multiple' => false,
                    'data' => 'group'
                ]
            );
        foreach ($this->stageTypes as $groupType) {
            $method = $groupType.'Config';
            $this->$method($builder, $options);
        }
    }
}
