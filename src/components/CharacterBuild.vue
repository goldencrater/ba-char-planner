<script setup>
import { ref, watch, onMounted, onUpdated, provide } from 'vue';
import { translateCharacter } from '../plugins/localisations.js';

import DropdownInput from './Inputs/DropdownInput.vue';
import { getRegionSettings, getJpRegionSettings } from '../composables/RegionSettings.js'

const props = defineProps(['wrapperClass', 'character', 'shared', 'readonly', 'borrowed']);
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
    exTooltip.value = 'Cost: ' + props.character.Skills.Ex['Level' + level].Cost + '<br>' + tC(props.character.Id, 'Skills.Ex.Level' + level + '.Description', true) + '<i></i>';
}

function updateSkill1Tooltip(level)
{
    skill1Tooltip.value = tC(props.character.Id, 'Skills.Skill1.Level' + level + '.Description', true) + '<i></i>';
}

function updateSkill2Tooltip(level)
{
    if(props.character.LocalStorage.Stars >= 6)
    {
        skill2Tooltip.value = tC(props.character.Id, 'Skills.Skill2Upgrade.Level' + level + '.Description', true) + '<i></i>';
    }
    else
    {
        skill2Tooltip.value = tC(props.character.Id, 'Skills.Skill2.Level' + level + '.Description', true) + '<i></i>';
    }
}

function updateSkill3Tooltip(level)
{
    skill3Tooltip.value = tC(props.character.Id, 'Skills.Skill3.Level' + level + '.Description', true) + '<i></i>';
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
    updateAllTooltips();
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
        return starNumber <= props.character.LocalStorage.Stars;
    }
    let invalid = [];
    switch(starNumber)
    {
        case 5:
        {
            invalid.push(4);
            invalid.push(8);
        } // fallthrough
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
    return !invalid.includes(props.character.LocalStorage.Stars);
}

function starClass()
{
    if(regionSettings.UniqueWeaponsAvailable && props.character.LocalStorage.Stars >= 5)
    {
        return 'unique-weapon';
    }
}

function showStarDropdown()
{
    if(props.readonly)
    {
        return;
    }
    const selectElement = document.getElementById(props.character.Name.toLowerCase() + 'starsdropdown');
    selectElement.style.zIndex = 10;
    setTimeout(checkStarDropdown, 1000, selectElement);
}

function checkStarDropdown(element)
{
    if(element.matches(':hover'))
    {
        setTimeout(checkStarDropdown, 1000, element);
        return;
    }
    hideStarDropdown();
}

function hideStarDropdown()
{
    const selectElement = document.getElementById(props.character.Name.toLowerCase() + 'starsdropdown');
    selectElement.style.zIndex = -10;
}

if(props.borrowed)
{
    classExtra.value = ' character-borrowed';
}

provide('readonly', props.readonly);

</script>

<template>
    <div :class="wrapperClass + ' character-wrapper character-striker character-damagetype-' + character.DamageType.toLowerCase() + classExtra" :style="createCharacterBackgroundTag(character.Icon)">
        <div class="character-settings selector-dropdown">
            <a href="#" role="button" :id="character.Name.toLowerCase() + 'settings'" data-bs-toggle="dropdown" aria-expanded="false" v-if="!readonly">
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
            <span :id="character.Name.toLowerCase() + 'stars'" @mouseover="showStarDropdown">
                <img :src="'/import/CharacterWeapons/' + character.CharacterWeapon.Icon + '.png'" v-if="regionSettings.UniqueWeaponsAvailable && character.LocalStorage.Stars >= 5">
                <img :class="starClass()" :src="'/images/star-lit.png'">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(2)">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(3)">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(4)">
                <img :class="starClass()" :src="'/images/star-lit.png'" v-if="displayStar(5)">
            </span>
            <select v-model="character.LocalStorage.Stars" :id="character.Name.toLowerCase() + 'starsdropdown'" @mouseout="hideStarDropdown">
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
                <option :value="5" v-if="!regionSettings.UniqueWeaponsAvailable">5</option>
                <option :value="5" v-if="regionSettings.UniqueWeaponsAvailable">5/UE 1</option>
                <option :value="6" v-if="regionSettings.UniqueWeaponMaxStar > 1">5/UE 2</option>
                <option :value="7" v-if="regionSettings.UniqueWeaponMaxStar > 2">5/UE 3</option>
                <option :value="8" v-if="regionSettings.UniqueWeaponMaxStar > 3">5/UE 4</option>
                <option :value="9" v-if="regionSettings.UniqueWeaponMaxStar > 4">5/UE 5</option>
            </select>
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
        <div class="character-skill selector-dropdown skill-tooltip">
            <DropdownInput :id="character.Name.toLowerCase() + 'skillEx'" v-model="character.LocalStorage.SkillEx" maxValue="5">
                <span>{{character.LocalStorage.SkillEx}}</span>
                <div class="top" v-html="exTooltip"></div>
            </DropdownInput>
        </div>
        <div class="character-skill selector-dropdown skill-tooltip">
            <DropdownInput :id="character.Name.toLowerCase() + 'skill1'" v-model="character.LocalStorage.Skill1" maxValue="10">
                <span>{{character.LocalStorage.Skill1}}</span>
                <div class="top" v-html="skill1Tooltip"></div>
            </DropdownInput>
        </div>
        <div class="character-skill selector-dropdown skill-tooltip">
            <DropdownInput :id="character.Name.toLowerCase() + 'skill2'" v-model="character.LocalStorage.Skill2" maxValue="10">
                <span>{{character.LocalStorage.Skill2}}</span>
                <div class="top" v-html="skill2Tooltip"></div>
            </DropdownInput>
        </div>
        <div class="character-skill selector-dropdown skill-tooltip">
            <DropdownInput :id="character.Name.toLowerCase() + 'skill3'" v-model="character.LocalStorage.Skill3" maxValue="10">
                <span>{{character.LocalStorage.Skill3}}</span>
                <div class="top" v-html="skill3Tooltip"></div>
            </DropdownInput>
        </div>
    </div>
</template>

<style>

.skill-tooltip .top
{
    min-width:200px;
    top:-20px;
    left:50%;
    transform:translate(-50%, -100%);
    padding:10px 20px;
    color:#FFFFFF;
    background-color:#000000;
    font-weight:normal;
    font-size:13px;
    border-radius:8px;
    position:absolute;
    z-index:99999999;
    box-sizing:border-box;
    box-shadow:0 1px 8px rgba(0,0,0,0.5);
    visibility:hidden; opacity:0; transition:opacity 0.8s;
    text-stroke: 0;
    -webkit-text-stroke: 0;
}

.skill-tooltip:hover .top
{
    visibility:visible;
    opacity:1;
}

.skill-tooltip .top span
{
    width: auto !important;
}

.skill-tooltip .top i
{
    position:absolute;
    top:100%;
    left:50%;
    margin-left:-12px;
    width:24px;
    height:12px;
    overflow:hidden;
}

.skill-tooltip .top i::after
{
    content:'';
    position:absolute;
    width:12px;
    height:12px;
    left:50%;
    transform:translate(-50%,-50%) rotate(45deg);
    background-color:#000000;
    box-shadow:0 1px 8px rgba(0,0,0,0.5);
}
</style>
