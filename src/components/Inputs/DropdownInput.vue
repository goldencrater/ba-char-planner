<script setup>
import { inject } from 'vue';

const props = defineProps(['id', 'modelValue', 'maxValue']);

const maxValue = parseInt(props.maxValue);
const readonly = inject('readonly');

function showDropdown()
{
    if(readonly)
    {
        return;
    }
    const selectElement = document.getElementById(props.id);
    selectElement.style.zIndex = 10;
    selectElement.style.display = 'inline-block';
    setTimeout(checkDropdown, 1000, selectElement);
}

function checkDropdown(element)
{
    if(element.matches(':hover') || element.matches(':focus'))
    {
        setTimeout(checkDropdown, 1000, element);
        return;
    }
    hideDropdown(false);
}

function hideDropdown(delay = true)
{
    const selectElement = document.getElementById(props.id);
    if(delay)
    {
        setTimeout(checkDropdown, 100, selectElement)
        return;
    }
    selectElement.style.zIndex = -10;
    selectElement.style.display = 'none';
}

</script>

<template>
    <span @mouseover="showDropdown">
        <slot>
            {{modelValue}}
        </slot>
    </span>
    <select :id="id" @focus="showDropdown" @blur="hideDropdown" @mouseout="hideDropdown" :value="modelValue" @input="$emit('update:modelValue', parseInt($event.target.value)); hideDropdown(false);">
        <option :value="n" v-for="n in maxValue" :key="n">{{n}}</option>
    </select>
</template>
