<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

class MfwPeriodType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        dump($builder, $options);
        $builder->add('0', TextType::class)
            ->add('1', TextType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'widgetProps' => [
                'itemProps' => [],
                'rangeProps' => [
                    'showTime' => false
                ]
            ]
        ]);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars['widgetProps'] = $options['widgetProps'];
        $view->vars['widgetProps']['itemProps']['id'] = $view->vars['id'];
        $view->vars['widgetProps']['itemProps']['name'] = $view->vars['name'];
    }
}
