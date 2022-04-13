<script setup>
const props = defineProps(['id', 'modelValue', 'maxValue']);

const maxValue = parseInt(props.maxValue);

</script>

<template>
    <a href="#" role="button" :id="id" data-bs-toggle="dropdown" aria-expanded="false">
        <slot>
            {{modelValue}}
        </slot>
    </a>
    <ul class="dropdown-menu number-input" :aria-labelledby="id">
        <li v-for="n in maxValue" :key="n">
            <a class="dropdown-item" href="#" @click="$emit('update:modelValue', n)">{{n}}</a>
        </li>
    </ul>
</template>
