<?php
namespace App\Services;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;

use App\Services\SiteConfig;

class Stages
{
    protected $stageTypes;

    public function __construct(SiteConfig $siteConfig)
    {
        $this->stageTypes = $siteConfig->get('stage_types');
    }

    public function choices()
    {
        return $this->stageTypes;
    }

    public function buildForm(FormBuilderInterface $builder, array $options, $type)
    {
        $method = $type.'Form';
        $this->$method($builder, $options);
    }

    public function configDB($params)
    {
        $method = $params['type'].'DB';
        return $this->$method($params);
    }

    protected function allForm(FormBuilderInterface $builder, array $options)
    {
        foreach ($this->stageTypes as $groupType) {
            $method = $groupType.'Form';
            $this->$method($builder, $options);
        }
    }

    protected function groupForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('group_players', TextType::class, ['attr' => ['class' => 'group']])
            ->add('group_count', TextType::class, ['attr' => ['class' => 'group']]);
    }

    protected function groupDB($params)
    {
        return json_encode(['players' => $params['group_players'], 'count' => $params['group_count']]);
    }

    protected function place2placeForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('place2place_places', TextType::class, ['attr' => ['class' => 'place2place']]);
    }

    protected function place2placeDB($params)
    {
        return json_encode(['places' => $params['place2place_places']]);
    }
}
