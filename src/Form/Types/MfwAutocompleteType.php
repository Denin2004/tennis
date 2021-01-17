<?php
namespace App\Form\Types;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

class MfwAutocompleteType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('search', TextType::class);
        $builder->add('value', HiddenType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'widgetProps' => [
                'itemProps' => []
            ]
        ]);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars['widgetProps'] = $options['widgetProps'];
        $view->vars['widgetProps']['itemProps']['id'] = $view->vars['id'];
        $view->vars['widgetProps']['itemProps']['name'] = $view->vars['name'];
        if (isset($view->vars['data'])) {
            $view->vars['widgetProps']['itemProps']['initialValue'] = $view->vars['data'];
        }
    }
}
