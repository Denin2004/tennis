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
        dump($options);
        $builder->add('group_competitor_id', HiddenType::class)
            ->add(
                'competitor_id',
                ChoiceType::class,
                [
                    'choices' => $this->stages->freeCompetitors(['stage_id' => $options['stage_id']]),
                    'expanded' => false,
                    'multiple' => false,
                    'data' => 'group'
                ]
            );
        $this->stages->buildForm($builder, $options, 'all');
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'stage_id' => 0
        ]);
    }
}
