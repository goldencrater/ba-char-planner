<script setup>
import { getItems, createCurrencyItem } from '../composables/Items.js';
import { ref, watch } from 'vue';

import ItemDisplay from './ItemDisplay.vue';

const props = defineProps(['itemUpgrades']);

const items = ref();

function updateItemsDisplay()
{
    const processedItems = getItems(props.itemUpgrades.Items);
    processedItems.unshift(createCurrencyItem(props.itemUpgrades.Currency));
    items.value = processedItems;
}

watch(props, () => {
    updateItemsDisplay();
}, {deep: true});

updateItemsDisplay();

</script>

<template>
    <div class="item-upgrade-wrapper">
        <template v-for="item in items">
            <ItemDisplay :item="item"></ItemDisplay>
        </template>
    </div>
</template>
