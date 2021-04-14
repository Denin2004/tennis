<?php
namespace App\Form\Competitions\Stages;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\OptionsResolver\OptionsResolver;

use App\Entity\Competitions\Stages;

class EditCompetitor extends AbstractType
{

    protected $stages;

    public function __construct(Stages $stages)
    {
        $this->stages = $stages;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('competitor_id', HiddenType::class)
            ->add('stage_id', HiddenType::class);
        if ($options['request']) {
            $builder->add('free_competitors', HiddenType::class);
        } else {
            $builder->add(
                'free_competitors',
                ChoiceType::class,
                [
                    'choices' => $this->stages->freeCompetitors(['stage_id' => $options['stage_id']]),
                    'expanded' => false,
                    'multiple' => false,
                    'data' => 'group'
                ]
            );
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'stage_id' => 0,
            'request' => false
        ]);
    }
}
