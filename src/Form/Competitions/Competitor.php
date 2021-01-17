<?php
namespace App\Form\Competitions;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use App\Form\Types\MfwAutocompleteType;

class Competitor extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('id', HiddenType::class)
            ->add('competition_id', HiddenType::class)
            ->add('competition_type', HiddenType::class)
            ->add('player1', MfwAutocompleteType::class)
            ->add('player2', MfwAutocompleteType::class);
    }
}
