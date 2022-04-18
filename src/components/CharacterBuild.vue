<script setup>
import { ref, watch, onMounted, onUpdated } from 'vue';
import { translateCharacter } from '../plugins/localisations.js';

import DropdownInput from './Inputs/DropdownInput.vue';
import { getRegionSettings, getJpRegionSettings } from '../composables/RegionSettings.js'

const props = defineProps(['character', 'shared']);
const emits = defineEmits(['swapSlot', 'setBorrowed']);

let regionSettings = null;

if(props.shared)
{
    regionSettings = getJpRegionSettings();
}
else
{
    regionSettings = getRegionSettings();
}

console.log(regionSettings);

const tC = translateCharacter;

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
        classExtra.value = ' character-borrowed';
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
    if(props.character.LocalStorage.Stars >= 6)
    {
        skill2Tooltip.value = tC(props.character.Id, 'Skills.Skill2Upgrade.Level' + level + '.Description', true);
    }
    else
    {
        skill2Tooltip.value = tC(props.character.Id, 'Skills.Skill2.Level' + level + '.Description', true);
    }
}

function updateSkill3Tooltip(level)
{
    skill3Tooltip.value = tC(props.character.Id, 'Skills.Skill3.Level' + level + '.Description', true);
}

function updateAllTooltips()
{
    updateExTooltip(props.character.LocalStorage.SkillEx);
    updateSkill1Tooltip(props.character.LocalStorage.Skill1);
    updateSkill2Tooltip(props.character.LocalStorage.Skill2);
    updateSkill3Tooltip(props.character.LocalStorage.Skill3);
}

updateAllTooltips();

onMounted(() => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {html: true, sanitize: false});
    });
});

onUpdated(() => {
    updateAllTooltips();
});

watch(props.character.LocalStorage, (newVal) => {
    updateExTooltip(newVal.SkillEx);
    updateSkill1Tooltip(newVal.Skill1);
    updateSkill2Tooltip(newVal.Skill2);
    updateSkill3Tooltip(newVal.Skill3);
}, {deep: true});

function displayStar(starNumber)
{
    if(!regionSettings.UniqueWeaponsAvailable)
    {
        return starNumber <= stars.value;
    }
    let invalid = [];
    switch(starNumber)
    {
        case 5:
        {
            invalid.push(4);
            invalid.push(8);
        }
        case 4:
        {
            invalid.push(3);
            invalid.push(7);
        } // fallthrough
        case 3:
        {
            invalid.push(2);
            invalid.push(6);
        } // fallthrough
        case 2:
        {
            invalid.push(1);
            invalid.push(5);
        }
    }
    return !invalid.includes(stars.value);
}

const stars = ref(props.character.LocalStorage.Stars);

function starClass()
{
    if(regionSettings.UniqueWeaponsAvailable && stars.value >= 5)
    {
        return 'unique-weapon';
    }
}

watch(stars, (newVal) => {
    props.character.LocalStorage.Stars = newVal;
    updateSkill2Tooltip(props.character.LocalStorage.Skill2);
})

if(props.character.Borrowed)
{
    classExtra.value = ' character-borrowed';
}

</script>

<template>
    <div :class="'character-wrapper character-striker character-damagetype-' + character.DamageType.toLowerCase() + classExtra" :style="createCharacterBackgroundTag(character.Icon)">
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
        <div class="character-name">
            {{$tC(character.Id, 'Name')}}
        </div>
        <div class="character-level selector-dropdown">
            <DropdownInput :id="character.Name.toLowerCase() + 'level'" v-model="character.LocalStorage.Level" :maxValue="regionSettings.MaxLevel"></DropdownInput>
        </div>
        <div class="character-rarity selector-dropdown">
            <a href="#" role="button" :id="character.Name.toLowerCase() + 'stars'" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="'/import/CharacterWeapons/' + character.CharacterWeapon.Icon + '.png'" v-if="regionSettings.UniqueWeaponsAvailable && stars >= 5">
                <img :class="starClass()" :src="'/images/star-lit.png'">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(2)">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(3)">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(4)">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(5)">
            </a>
            <ul class="dropdown-menu number-input" :aria-labelledby="character.Name.toLowerCase() + 'stars'">
                <li>
                    <a class="dropdown-item" href="#" @click="stars = 1">1</a>
                    <a class="dropdown-item" href="#" @click="stars = 2">2</a>
                    <a class="dropdown-item" href="#" @click="stars = 3">3</a>
                    <a class="dropdown-item" href="#" @click="stars = 4">4</a>
                    <a class="dropdown-item" href="#" @click="stars = 5" v-if="!regionSettings.UniqueWeaponsAvailable">5</a>
                    <a class="dropdown-item" href="#" @click="stars = 5" v-if="regionSettings.UniqueWeaponMaxStar > 0">5/UE1</a>
                    <a class="dropdown-item" href="#" @click="stars = 6" v-if="regionSettings.UniqueWeaponMaxStar > 1">5/UE2</a>
                    <a class="dropdown-item" href="#" @click="stars = 7" v-if="regionSettings.UniqueWeaponMaxStar > 2">5/UE3</a>
                    <a class="dropdown-item" href="#" @click="stars = 8" v-if="regionSettings.UniqueWeaponMaxStar > 3">5/UE4</a>
                    <a class="dropdown-item" href="#" @click="stars = 9" v-if="regionSettings.UniqueWeaponMaxStar > 4">5/UE5</a>
                </li>
            </ul>
        </div>
        <div class="character-bond selector-dropdown" style="background: rgba(0, 0, 0, 0.5) url('/images/bond.png')">
            <DropdownInput :id="character.Name.toLowerCase() + 'bond'" v-model="character.LocalStorage.Bond" :maxValue="regionSettings.MaxBond"></DropdownInput>
        </div>
        <div class="character-equipment selector-dropdown" :style="createEquipBackgroundTag(character.Equipment.Slot1, character.LocalStorage.Equip1)">
            <DropdownInput :id="character.Name.toLowerCase() + 'equip1'" v-model="character.LocalStorage.Equip1" :maxValue="regionSettings.MaxEquipLevel"></DropdownInput>
        </div>
        <div class="character-equipment selector-dropdown" :style="createEquipBackgroundTag(character.Equipment.Slot2, character.LocalStorage.Equip2)">
            <DropdownInput :id="character.Name.toLowerCase() + 'equip2'" v-model="character.LocalStorage.Equip2" :maxValue="regionSettings.MaxEquipLevel"></DropdownInput>
        </div>
        <div class="character-equipment selector-dropdown" :style="createEquipBackgroundTag(character.Equipment.Slot3, character.LocalStorage.Equip3)">
            <DropdownInput :id="character.Name.toLowerCase() + 'equip3'" v-model="character.LocalStorage.Equip3" :maxValue="regionSettings.MaxEquipLevel"></DropdownInput>
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
