<?php
namespace App\Services;

use Symfony\Component\Form\FormView;

class FormTransformer
{
    public function transform(FormView $view)
    {
        $res = [
            'name' => $view->vars['name'],
            'method' => $view->vars['method'],
            'elements' => []
        ];
        foreach ($view->children as $key => $child) {
            $res['elements'][$key] = $this->formElement($child);
        }
        return $res;
    }

    private function formElement(FormView $element)
    {
        $cache_key = explode('_', $element->vars['cache_key']);
        if (count($element->children) != 0) {
            foreach ($element->children as $key => $child) {
                $res[$key] = $this->formElement($child);
            }
            $res['id'] = $element->vars['id'];
            $res['type'] = array_pop($cache_key);
            $res['widgetProps'] = $element->vars['widgetProps'] ? $element->vars['widgetProps'] : [];
            $res['widgetProps']['id'] = $element->vars['id'];
            $res['widgetProps']['name'] = $element->vars['name'];
            return $res;
        }
        $res = [
            'widgetProps' => [
                'id' => $element->vars['id'],
                'initialValue' => $element->vars['value'],
                'name' => $element->vars['name']
            ],
            'id' => $element->vars['id'],
            'type' => array_pop($cache_key),
            'attr' => $element->vars['attr']
        ];
        if (isset($element->vars['choices'])) {
            $res['multiple'] = $element->vars['multiple'];
            $res['expanded'] = $element->vars['expanded'];
            $res['choices'] = [];
            $res['widgetProps']['translate'] = $element->vars['choice_translation_domain'] === false ? "false" : "true";
            foreach ($element->vars['choices'] as $choice) {
                $res['choices'][] = [
                    'label' => $choice->label,
                    'value' => $choice->value
                ];
            }
        }
        if ($res['type'] == 'typeahead') {
            $res['src'] = $element->vars['src'];
            $res['text'] = $element->vars['text'];
        }
        if ($res['type'] == 'checkbox') {
             $res['checked'] = isset($element->vars['data']) ? $element->vars['data'] == $element->vars['value'] : false;
        }
        return $res;
    }
}
