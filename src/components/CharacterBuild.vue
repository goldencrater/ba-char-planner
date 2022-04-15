<script setup>
import { ref, watch, onMounted, inject } from 'vue';

import DropdownInput from './Inputs/DropdownInput.vue';

const props = defineProps(['character']);
const emits = defineEmits(['swapSlot', 'setBorrowed']);

const tC = inject('translateCharacter');

function createCharacterBackgroundTag(path)
{
    return 'background-image: url("/import/Character/' + path + '.png")';
}

function createEquipBackgroundTag(path, tier)
{
    let finalTier = tier;
    if(tier === 0)
    {
        finalTier = 1
    }
    return 'background: rgba(0, 0, 0, 0.5) url("/import/Equipment/Equipment_Icon_' + path + '_Tier' + finalTier + '.png")';
}

const classExtra = ref('');

function toggleBorrowed()
{
    if(classExtra.value.length > 0)
    {
        classExtra.value = '';
        emits('setBorrowed', null);
    }
    else
    {
        classExtra.value = 'character-borrowed';
        emits('setBorrowed', props.character.Id);
    }
}

const exTooltip = ref('');
const skill1Tooltip = ref('');
const skill2Tooltip = ref('');
const skill3Tooltip = ref('');

function updateExTooltip(level)
{
    exTooltip.value = 'Cost: ' + props.character.Skills.Ex['Level' + level].Cost + '<br>' + tC(props.character.Id, 'Skills.Ex.Level' + level + '.Description', true);
}

function updateSkill1Tooltip(level)
{
    skill1Tooltip.value = tC(props.character.Id, 'Skills.Skill1.Level' + level + '.Description', true);
}

function updateSkill2Tooltip(level)
{
    skill2Tooltip.value = tC(props.character.Id, 'Skills.Skill2.Level' + level + '.Description', true);
}

function updateSkill3Tooltip(level)
{
    skill3Tooltip.value = tC(props.character.Id, 'Skills.Skill3.Level' + level + '.Description', true);
}

updateExTooltip(props.character.LocalStorage.SkillEx);
updateSkill1Tooltip(props.character.LocalStorage.Skill1);
updateSkill2Tooltip(props.character.LocalStorage.Skill2);
updateSkill3Tooltip(props.character.LocalStorage.Skill3);

onMounted(() => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {html: true, sanitize: false});
    })
})

watch(props.character.LocalStorage, (newVal) => {
    updateExTooltip(newVal.SkillEx);
    updateSkill1Tooltip(newVal.Skill1);
    updateSkill2Tooltip(newVal.Skill2);
    updateSkill3Tooltip(newVal.Skill3);
}, {deep: true});

if(props.character.Borrowed)
{
    classExtra.value = 'character-borrowed';
}

</script>

<template>
    <div :class="'character-wrapper character-striker ' + classExtra" :style="createCharacterBackgroundTag(character.Icon)">
        <div class="character-settings selector-dropdown">
            <a href="#" role="button" :id="character.Name.toLowerCase() + 'settings'" data-bs-toggle="dropdown" aria-expanded="false">
                <font-awesome-icon icon="gear"></font-awesome-icon>
            </a>
            <ul class="dropdown-menu" :aria-labelledby="character.Name.toLowerCase() + 'settings'">
                <li>
                    <a @click="toggleBorrowed">Toggle Borrowed</a>
                </li>
                <li>
                    <a @click="$emit('swapSlot', character, null)">Delete</a>
                </li>
                <li>
                    <a @click="$emit('swapSlot', character, 1)">Move to Slot 1</a>
                </li>
                <li>
                    <a @click="$emit('swapSlot', character, 2)">Move to Slot 2</a>
                </li>
                <li>
                    <a @click="$emit('swapSlot', character, 3)" v-if="character.Type === 'Striker'">Move to Slot 3</a>
                </li>
                <li>
                    <a @click="$emit('swapSlot', character, 4)" v-if="character.Type === 'Striker'">Move to Slot 4</a>
                </li>
            </ul>
        </div>
        <div :class="'character-name textcolor-damagetype-' + character.DamageType.toLowerCase()">
            {{$tC(character.Id, 'Name')}}
        </div>
        <div class="character-level selector-dropdown">
            <DropdownInput :id="character.Name.toLowerCase() + 'level'" v-model="character.LocalStorage.Level" maxValue="73"></DropdownInput>
        </div>
        <div class="character-rarity selector-dropdown">
            <DropdownInput :id="character.Name.toLowerCase() + 'stars'" v-model="character.LocalStorage.Stars" maxValue="5">
                <img :src="'/images/star-lit.png'">
                <img :src="'/images/star-lit.png'" v-if="character.LocalStorage.Stars > 1">
                <img :src="'/images/star-lit.png'" v-if="character.LocalStorage.Stars > 2">
                <img :src="'/images/star-lit.png'" v-if="character.LocalStorage.Stars > 3">
                <img :src="'/images/star-lit.png'" v-if="character.LocalStorage.Stars > 4">
            </DropdownInput>
        </div>
        <div class="character-bond selector-dropdown" style="background: rgba(0, 0, 0, 0.5) url('/images/bond.png')">
            <DropdownInput :id="character.Name.toLowerCase() + 'bond'" v-model="character.LocalStorage.Bond" maxValue="20"></DropdownInput>
        </div>
        <div class="character-equipment selector-dropdown" :style="createEquipBackgroundTag(character.Equipment.Slot1, character.LocalStorage.Equip1)">
            <DropdownInput :id="character.Name.toLowerCase() + 'equip1'" v-model="character.LocalStorage.Equip1" maxValue="5"></DropdownInput>
        </div>
        <div class="character-equipment selector-dropdown" :style="createEquipBackgroundTag(character.Equipment.Slot2, character.LocalStorage.Equip2)">
            <DropdownInput :id="character.Name.toLowerCase() + 'equip2'" v-model="character.LocalStorage.Equip2" maxValue="5"></DropdownInput>
        </div>
        <div class="character-equipment selector-dropdown" :style="createEquipBackgroundTag(character.Equipment.Slot3, character.LocalStorage.Equip3)">
            <DropdownInput :id="character.Name.toLowerCase() + 'equip3'" v-model="character.LocalStorage.Equip3" maxValue="5"></DropdownInput>
        </div>
        <div class="character-skill selector-dropdown">
            <DropdownInput :id="character.Name.toLowerCase() + 'skillEx'" v-model="character.LocalStorage.SkillEx" maxValue="5">
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" :title="exTooltip" :data-bs-original-title="exTooltip">{{character.LocalStorage.SkillEx}}</span>
            </DropdownInput>
        </div>
        <div class="character-skill selector-dropdown">
            <DropdownInput :id="character.Name.toLowerCase() + 'skill1'" v-model="character.LocalStorage.Skill1" maxValue="10">
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" :title="skill1Tooltip" :data-bs-original-title="skill1Tooltip">{{character.LocalStorage.Skill1}}</span>
            </DropdownInput>
        </div>
        <div class="character-skill selector-dropdown">
            <DropdownInput :id="character.Name.toLowerCase() + 'skill2'" v-model="character.LocalStorage.Skill2" maxValue="10">
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" :title="skill2Tooltip" :data-bs-original-title="skill2Tooltip">{{character.LocalStorage.Skill2}}</span>
            </DropdownInput>
        </div>
        <div class="character-skill selector-dropdown">
            <DropdownInput :id="character.Name.toLowerCase() + 'skill3'" v-model="character.LocalStorage.Skill3" maxValue="10">
                <span data-bs-toggle="tooltip" data-bs-placement="bottom" :title="skill3Tooltip" :data-bs-original-title="skill3Tooltip">{{character.LocalStorage.Skill3}}</span>
            </DropdownInput>
        </div>
    </div>
</template>
