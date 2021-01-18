<?php
namespace App\Form\Competitions\Stages;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

use App\Services\SiteConfig;

class Config extends AbstractType
{
    protected $stageTypes;

    public function __construct(SiteConfig $siteConfig)
    {
        $this->stageTypes = $siteConfig->get('stage_types');
    }

    protected function groupConfig(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class)
            ->add('group_players', TextType::class, ['attr' => ['class' => 'group']])
            ->add('group_count', TextType::class, ['attr' => ['class' => 'group']]);
    }

    protected function testConfig(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', TextType::class)
            ->add('test_players', TextType::class, ['attr' => ['class' => 'test']])
            ->add('test_count', TextType::class, ['attr' => ['class' => 'test']]);
    }
}