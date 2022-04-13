<script setup>
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
});
</script>

<template>
    <div :class="'item-wrapper ' + props.wrapperClass">
        <img :src="'/import/Items/' + props.item.Icon + '.png'" :alt="props.item.Name" :class="'item-icon item-' + props.item.Rarity.toLowerCase()">
        <template v-if="props.item.Quantity">
            <span class="item-count">{{props.item.Quantity}}</span>
        </template>
    </div>
</template>

<style>

.item-wrapper
{
    position: relative;
    width: 100px;
    display: inline-block;
    margin: 2px;
}

.item-wrapper img.item-icon
{
    width: 100px;
    background-size: 100px
}

.item-wrapper img.item-icon.item-n
{
    background-image: url('/images/background_n.png');
}

.item-wrapper img.item-icon.item-r
{
    background-image: url('/images/background_r.png');
}

.item-wrapper img.item-icon.item-sr
{
    background-image: url('/images/background_sr.png');
}

.item-wrapper img.item-icon.item-ssr
{
    background-image: url('/images/background_ssr.png');
}

.item-wrapper span.item-count
{
    display: block;
    position: absolute;
    top: 55px;
    right: 15px;
    font-weight: bold;
}
</style>
