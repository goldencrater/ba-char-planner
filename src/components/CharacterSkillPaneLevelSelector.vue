<script setup>
import { ref, watch, inject } from 'vue';

import SkillUpgradePanel from './SkillUpgradePanel.vue';

const props = defineProps({
    'skill': String,
    'character': Object,
    'displayUpgrades': {type: Boolean, default: false}
});
const tC = inject('translateCharacter');

const skillDescription = ref();
const cost = ref();
const itemUpgrades = ref({itemUpgrades: null});
const visible = ref(true);
const displayAllLevels = ref(true);

function changeDescription(level)
{
    const selectedSkill = props.character.Skills[props.skill];
    const levelSelector = 'Level' + level;
    skillDescription.value = tC(props.character.Id, 'Skills.' + props.skill + '.' + levelSelector + '.Description', true);
    if((!props.skill.Level10 && level == 5) || (level == 10))
    {
        visible.value = false;
    }
    else
    {
        itemUpgrades.value.itemUpgrades = selectedSkill[levelSelector].LevelUpMats;
        visible.value = true;
    }
    if(selectedSkill[levelSelector].Cost)
    {
        cost.value = 'Cost: ' + selectedSkill[levelSelector].Cost;
    }
    else
    {
        cost.value = '';
    }
    if(selectedSkill.Level10)
    {
        displayAllLevels.value = true;
    }
    else
    {
        displayAllLevels.value = false;
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
        <template v-if="displayAllLevels">
            <button type="button" class="btn btn-primary" @click="changeDescription(6)">6</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(7)">7</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(8)">8</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(9)">9</button>
            <button type="button" class="btn btn-primary" @click="changeDescription(10)">10</button>
        </template>
    </div>
    <div class="character-skill-description-wrapper">
        <div class="character-skill-name">Name: {{$tC(character.Id, 'Skills.' + skill + '.Name')}}</div>
        <div class="character-skill-cost">{{cost}}</div>
        <div class="character-skill-description" v-html="skillDescription"></div>
        <SkillUpgradePanel v-bind="itemUpgrades" v-if="visible"></SkillUpgradePanel>
    </div>
</template>
