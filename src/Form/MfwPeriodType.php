<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\CallbackTransformer;

use App\Services\SiteConfig;

class MfwPeriodType extends AbstractType
{

    public function __construct(SiteConfig $siteConfig)
    {
        $this->dateFormat = $siteConfig->get('php_date_format');
        $this->timeFormat = $siteConfig->get('php_time_format');
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $this->options = $options;
        $builder->add('0', TextType::class)
            ->add('1', TextType::class);
        $transformer = new CallbackTransformer(
            function ($transform) {
                return $transform;
            },
            function ($reverseTransform) {
                $dt = new \DateTime($reverseTransform);
                return $this->options['widgetProps']['showTime'] === true ?
                    $dt->format($this->dateFormat.' '.$this->timeFormat) : $dt->format($this->timeFormat);
            }
        );
        $builder->get('0')
            ->addModelTransformer($transformer);
        $builder->get('1')
            ->addModelTransformer($transformer);
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
