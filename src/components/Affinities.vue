<script setup>
const props = defineProps(['type', 'rating'])

import Urban from './icons/Urban.vue';
import Outdoors from './icons/Outdoors.vue';
import Indoors from './icons/Indoors.vue';
</script>

<template>
    <div :class="'affinity-wrapper affinity-' + type">
        <template v-if="type === 'urban'">
            <Urban></Urban>
        </template>
        <template v-if="type === 'outdoors'">
            <Outdoors></Outdoors>
        </template>
        <template v-if="type === 'indoors'">
            <Indoors></Indoors>
        </template>
        <img :src="'/images/affinity_' + props.rating.toLowerCase() + '.png'">
    </div>
</template>
