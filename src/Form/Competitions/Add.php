<?php
namespace App\Form\Competitions;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Validator\Constraints\NotBlank;

use App\Entity\Courts;
use App\Form\MfwPeriodType;

class Add extends AbstractType
{

    private $courts;

    public function __construct(Courts $courts)
    {
        $this->courts = $courts;
    }

    private function disabledMinutes()
    {
        $res = [];
        for ($i = 1; $i < 60; $i++) {
            if (($i%15) != 0) {
                $res[] = $i;
            }
        }
        return $res;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add(
            'period',
            MfwPeriodType::class,
            [
                'widgetProps' => [
                    'showTime' => true,
                    'disableTime' => [
                        'disabledMinutes' => $this->disabledMinutes()
                    ]
                ]
            ]
        )->add(
            'court_id',
            ChoiceType::class,
            [
                'choices' => $this->courts->choices(),
                'expanded' => false,
                'multiple' => false,
                'choice_translation_domain' => false
            ]
        )->add(
            'type',
            ChoiceType::class,
            [
                'choices' => [
                    'competition.types.mens' => 'competition.types.mens',
                    'competition.types.womens' => 'competition.types.womens',
                    'competition.types.mensdouble' => 'competition.types.mensdouble',
                    'competition.types.womensdouble' => 'competition.types.womensdouble',
                    'competition.types.mixt' => 'competition.types.mixt'
                ],
                'expanded' => false,
                'multiple' => false
            ]
        )
        ->add('id', HiddenType::class);
    }
}
