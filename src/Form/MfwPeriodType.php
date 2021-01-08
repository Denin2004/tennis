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
        $builder->add('0', TextType::class)
            ->add('1', TextType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'widgetProps' => [
                'showTime' => false,
                'itemProps' => [],
                'rangeProps' => []
            ]
        ]);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars['widgetProps'] = $options['widgetProps'];
        $view->vars['widgetProps']['itemProps']['id'] = $view->vars['id'];
        $view->vars['widgetProps']['itemProps']['name'] = $view->vars['name'];
        if (isset($view->vars['data'])) {
            $view->vars['widgetProps']['rangeProps']['defaultValue'] = $view->vars['data'];
        }
    }
}
