<script setup>
import { ref } from 'vue';

import CharacterSkillPaneLevelSelector from './CharacterSkillPaneLevelSelector.vue';

const props = defineProps(['character']);
const skillRef = ref({skill: 'Ex'});

function changeSkill(type)
{
    let key = '';
    switch(type)
    {
        case 'ex':
        {
            key = 'Ex';
            break;
        }
        case '1':
        case '2':
        case '3':
        {
            key = 'Skill' + type;
            break;
        }
    }
    skillRef.value.skill = key;
}

</script>

<template>
<div :class="'character-skill-pane damagetype-' + props.character.DamageType.toLowerCase()">
    <div class="character-skill skill-ex" @click="changeSkill('ex')">
        <span>Ex Skill</span>
        <img :src="'/import/Skills/' + character.Skills.Ex.Level1.Icon + '.png'">
    </div>
    <div class="character-skill skill-skill1" @click="changeSkill('1')">
        <span>Basic Skill</span>
        <img :src="'/import/Skills/' + character.Skills.Skill1.Level1.Icon + '.png'">
    </div>
    <div class="character-skill skill-skill2" @click="changeSkill('2')">
        <span>Enhanced Skill</span>
        <img :src="'/import/Skills/' + character.Skills.Skill2.Level1.Icon + '.png'">
    </div>
    <div class="character-skill skill-skill3" @click="changeSkill('3')">
        <span>Sub Skill</span>
        <img :src="'/import/Skills/' + character.Skills.Skill3.Level1.Icon + '.png'">
    </div>
    <div class="character-skill-description-wrapper">
        <CharacterSkillPaneLevelSelector v-bind="skillRef" :character="character" :displayUpgrades="true"></CharacterSkillPaneLevelSelector>
    </div>
</div>

</template>
