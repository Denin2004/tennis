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
        $res = [];
        if (count($element->children) != 0) {
            foreach ($element->children as $key => $child) {
                $res[$key] = $this->formElement($child);
            }
            return $res;
        }
        $cache_key = explode('_', $element->vars['cache_key']);
        $res = [
            'value' => $element->vars['value'],
            'id' => $element->vars['id'],
            'attr' => $element->vars['attr'],
            'full_name' => $element->vars['full_name'],
            'type' => array_pop($cache_key)
        ];
        if (isset($element->vars['choices'])) {
            $res['multiple'] = $element->vars['multiple'];
            $res['expanded'] = $element->vars['expanded'];
            $res['choices'] = [];
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
