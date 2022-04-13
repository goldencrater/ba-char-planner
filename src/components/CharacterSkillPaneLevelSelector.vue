<script setup>
import { ref, watch } from 'vue';

import SkillUpgradePanel from './SkillUpgradePanel.vue';

const props = defineProps({
    'skill': Object,
    'displayUpgrades': {type: Boolean, default: false}
});

const skillDescription = ref();
const cost = ref();
const itemUpgrades = ref({itemUpgrades: null});
const visible = ref(true);

const regex = /\[c\]\[([a-f0-9]{6})\]([^[]+)\[-\]\[\/c\]/g

function changeDescription(level)
{
    const selected = 'Level' + level;
    skillDescription.value = props.skill[selected].Description.replace(regex, '<span style="color: #$1;">$2</span>');
    if((!props.skill.Level10 && level == 5) || (level == 10))
    {
        visible.value = false;
    }
    else
    {
        itemUpgrades.value.itemUpgrades = props.skill[selected].LevelUpMats;
        visible.value = true;
    }
    if(props.skill[selected].Cost)
    {
        cost.value = 'Cost: ' + props.skill[selected].Cost;
    }
    else
    {
        cost.value = '';
    }
}

watch(props, () => {
    changeDescription(1);
}, {deep: true});

changeDescription(1);
</script>

<template>
    <div class="character-skill-description-level-selector btn-group">
        <button type="button" class="btn btn-primary" @click="changeDescription(1);">1</button>
        <button type="button" class="btn btn-primary" @click="changeDescription(2);">2</button>
        <button type="button" class="btn btn-primary" @click="changeDescription(3);">3</button>
        <button type="button" class="btn btn-primary" @click="changeDescription(4);">4</button>
        <button type="button" class="btn btn-primary" @click="changeDescription(5);">5</button>
        <template v-if="props.skill.Level10">
            <button type="button" class="btn btn-primary" @click="changeDescription(6)">6</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(7)">7</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(8)">8</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(9)">9</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(10)">10</button>
        </template>
    </div>
    <div class="character-skill-description-wrapper">
        <div class="character-skill-name">Name: {{props.skill.Name}}</div>
        <div class="character-skill-cost">{{cost}}</div>
        <div class="character-skill-description" v-html="skillDescription"></div>
        <SkillUpgradePanel v-bind="itemUpgrades" v-if="visible"></SkillUpgradePanel>
    </div>
</template>
