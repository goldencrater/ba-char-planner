<script setup>
const props = defineProps(['id', 'modelValue', 'maxValue']);

const maxValue = parseInt(props.maxValue);

function showDropdown()
{
    const selectElement = document.getElementById(props.id);
    selectElement.style.zIndex = 10;
    setTimeout(checkDropdown, 1000, selectElement);
}

function checkDropdown(element)
{
    if(element.matches(':hover'))
    {
        setTimeout(checkDropdown, 1000, element);
        return;
    }
    hideDropdown();
}

function hideDropdown()
{
    const selectElement = document.getElementById(props.id);
    selectElement.style.zIndex = -10;
}

</script>

<template>
    <span @mouseover="showDropdown">
        <slot>
            {{modelValue}}
        </slot>
    </span>
    <select :id="id" @focus="showDropdown" @blur="hideDropdown" @mouseout="hideDropdown" :value="modelValue" @input="$emit('update:modelValue', parseInt($event.target.value))">
        <option :value="n" v-for="n in maxValue" :key="n">{{n}}</option>
    </select>
</template>
