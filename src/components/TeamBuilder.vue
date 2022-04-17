<script setup>
import { ref, watch } from 'vue';

import { getCharacterById, hashCharStats, unhashCharStats } from '../composables/Character.js';
import { useCharacterStorage } from '../stores/CharacterStorage.js';

import CharacterSearch from '../components/CharacterSearch.vue';
import CharacterBuild from '../components/CharacterBuild.vue';

const props = defineProps(['teamHash', 'shared']);
const emit = defineEmits(['update:teamHash'])

const sortedList = ref([]);
const pickedChars = ref({});

const teamBuild = ref({
    strikers: {1: null, 2: null, 3: null, 4: null},
    specials: {1: null, 2: null}
});

let borrowed = null;

const charStorage = useCharacterStorage();

function updateList(newList)
{
    sortedList.value = newList;
}

function styleCharacter(character)
{
    let classNames = 'character-select character-';
    if(character.Type === 'Striker')
    {
        classNames += 'striker';
        if(teamBuild.value.strikers[1] !== null &&
            teamBuild.value.strikers[2] !== null &&
            teamBuild.value.strikers[3] !== null &&
            teamBuild.value.strikers[4] !== null)
        {
            classNames += ' already-selected';
        }
    }
    else
    {
        classNames += 'special';
        if(teamBuild.value.specials[1] !== null &&
            teamBuild.value.specials[2] !== null)
        {
            classNames += ' already-selected';
        }
    }
    if(typeof(pickedChars.value[character.Id]) !== 'undefined')
    {
        classNames += ' already-selected';
    }
    return classNames;
}

function unitAdd(character)
{
    let slot = 0;
    let elementId = '';
    if(typeof(pickedChars.value[character.Id]) !== 'undefined')
    {
        return;
    }
    if(character.Type === 'Striker')
    {
        if(teamBuild.value.strikers[1] === null)
        {
            slot = 1;
        }
        else if (teamBuild.value.strikers[2] === null)
        {
            slot = 2;
        }
        else if (teamBuild.value.strikers[3] === null)
        {
            slot = 3;
        }
        else if (teamBuild.value.strikers[4] === null)
        {
            slot = 4;
        }
        else
        {
            return;
        }
        teamBuild.value.strikers[slot] = character.Id;
        elementId = 'character-striker-' + slot;
    }
    else
    {
        if(teamBuild.value.specials[1] === null)
        {
            slot = 1;
        }
        else if (teamBuild.value.specials[2] === null)
        {
            slot = 2;
        }
        teamBuild.value.specials[slot] = character.Id;
        elementId = 'character-special-' + slot;
    }
    character.ElementId = elementId;
    character.LocalStorage = charStorage.getCharacter(character);
    watch(character.LocalStorage, () => {
        updateHash();
    });
    pickedChars.value[character.Id] = character;
    document.getElementById('characterSearch').value = '';
    sortedList.value = [];
    updateHash();
}

function swapSlot(character, target)
{
    let slot = 0;
    if(character.Type === 'Striker')
    {
        if(teamBuild.value.strikers[1] === character.Id)
        {
            slot = 1;
        }
        else if (teamBuild.value.strikers[2] === character.Id)
        {
            slot = 2;
        }
        else if (teamBuild.value.strikers[3] === character.Id)
        {
            slot = 3;
        }
        else if (teamBuild.value.strikers[4] === character.Id)
        {
            slot = 4;
        }
    }
    else
    {
        if(teamBuild.value.specials[1] === character.Id)
        {
            slot = 1;
        }
        else if (teamBuild.value.specials[2] === character.Id)
        {
            slot = 2;
        }
    }
    if(target === null)
    {
        if(character.Type === 'Striker')
        {
            teamBuild.value.strikers[slot] = null;
        }
        else
        {
            teamBuild.value.specials[slot] = null;
        }
        delete pickedChars.value[character.Id];
        return;
    }

    const origElementId = character.ElementId;
    let targetCharId = 0;

    if(character.Type === 'Striker')
    {
        character.ElementId = 'character-striker-' + target;
        targetCharId = teamBuild.value.strikers[target];
        teamBuild.value.strikers[slot] = targetCharId;
        teamBuild.value.strikers[target] = character.Id;
        if(teamBuild.value.strikers[slot])
        {
            pickedChars.value[teamBuild.value.strikers[slot]].ElementId = origElementId;
        }
        pickedChars.value[character.Id] = character;
    }
    else
    {
        character.ElementId = 'character-special-' + target;
        teamBuild.value.specials[slot] = teamBuild.value.specials[target];
        teamBuild.value.specials[target] = character.Id;
        if(teamBuild.value.strikers[slot])
        {
            pickedChars.value[teamBuild.value.specials[slot]].ElementId = origElementId;
        }
        pickedChars.value[character.Id] = character;
    }
    updateHash();
}

function updateHash()
{
    let charHash = '';
    for(let i = 1; i <= 4; i++)
    {
        if(teamBuild.value.strikers[i] !== null)
        {
            charHash += hashCharStats(pickedChars.value[teamBuild.value.strikers[i]].LocalStorage) + ';';
        }
        else
        {
            charHash += 'n;'
        }
    }
    for(i = 1; i <= 2; i++)
    {
        if(teamBuild.value.specials[i] !== null)
        {
            charHash += hashCharStats(pickedChars.value[teamBuild.value.specials[i]].LocalStorage) + ';';
        }
        else
        {
            charHash += 'n;'
        }
    }
    if(borrowed)
    {
        charHash += borrowed + ';';
    }
    else
    {
        charHash += 'n;'
    }
    emit('update:teamHash', charHash);
}

function setBorrowed(charId)
{
    borrowed = charId;
    updateHash();
}

if(props.teamHash)
{
    const charHashes = props.teamHash.split(';');
    for(var i = 0; i < 4; i++)
    {
        if(charHashes[i].length !== 1)
        {
            let charStats = unhashCharStats(charHashes[i]);
            teamBuild.value.strikers[i + 1] = charStats.Id;
            pickedChars.value[charStats.Id] = getCharacterById(charStats.Id, false);
            if(props.shared)
            {
                pickedChars.value[charStats.Id].LocalStorage = ref(charStats);
            }
            else
            {
                pickedChars.value[charStats.Id].LocalStorage = charStorage.getCharacter(pickedChars.value[charStats.Id]);
            }
            watch(pickedChars.value[charStats.Id].LocalStorage, () => {
                updateHash();
            });
            pickedChars.value[charStats.Id].ElementId = 'character-striker-' + (i + 1);
        }
    }
    if(charHashes[4].length !== 1)
    {
        let charStats = unhashCharStats(charHashes[4]);
        teamBuild.value.specials[1] = charStats.Id;
        pickedChars.value[charStats.Id] = getCharacterById(charStats.Id, false);
        if(props.shared)
        {
            pickedChars.value[charStats.Id].LocalStorage = ref(charStats);
        }
        else
        {
            pickedChars.value[charStats.Id].LocalStorage = charStorage.getCharacter(pickedChars.value[charStats.Id]);
        }
        watch(pickedChars.value[charStats.Id].LocalStorage, () => {
            updateHash();
        });
        pickedChars.value[charStats.Id].ElementId = 'character-special-1';
    }
    if(charHashes[5].length !== 1)
    {
        let charStats = unhashCharStats(charHashes[5]);
        teamBuild.value.specials[2] = charStats.Id;
        pickedChars.value[charStats.Id] = getCharacterById(charStats.Id, false);
        if(props.shared)
        {
            pickedChars.value[charStats.Id].LocalStorage = ref(charStats);
        }
        else
        {
            pickedChars.value[charStats.Id].LocalStorage = charStorage.getCharacter(pickedChars.value[charStats.Id]);
        }
        watch(pickedChars.value[charStats.Id].LocalStorage, () => {
            updateHash();
        });
        pickedChars.value[charStats.Id].ElementId = 'character-special-2';
    }
    if(charHashes[6].length !== 1)
    {
        pickedChars.value[charHashes[6]].Borrowed = true;
        borrowed = charHashes[6];
    }
}

updateHash();

</script>

<template>
    <div class="team-builder">
        <div class="form-floating">
            <CharacterSearch @update-list="updateList" :settings="{emptyReturn: true}" id="characterSearch" class="form-control"></CharacterSearch>
            <label for="characterSearch">Character Name</label>
        </div>
        <div class="character-search-list">
            <ul class="character-search-wrapper">
                <template v-for="(character, index) in sortedList" :key="index">
                    <li @click="unitAdd(character)" :class="styleCharacter(character)">
                        <img :src="'/import/Character/' + character.Icon + '.png'" class="character-portrait">
                        <span class="character-name">{{$tC(character.Id, 'Name')}}</span>
                    </li>
                </template>
            </ul>
        </div>
        <div class="characters-picked">
            <CharacterBuild v-if="teamBuild.strikers[1]" :character="pickedChars[teamBuild.strikers[1]]" :id="pickedChars[teamBuild.strikers[1]].ElementId" :shared="props.shared" @swap-slot="swapSlot" @set-borrowed="setBorrowed"></CharacterBuild>
            <CharacterBuild v-if="teamBuild.strikers[2]" :character="pickedChars[teamBuild.strikers[2]]" :id="pickedChars[teamBuild.strikers[2]].ElementId" :shared="props.shared" @swap-slot="swapSlot" @set-borrowed="setBorrowed"></CharacterBuild>
            <CharacterBuild v-if="teamBuild.strikers[3]" :character="pickedChars[teamBuild.strikers[3]]" :id="pickedChars[teamBuild.strikers[3]].ElementId" :shared="props.shared" @swap-slot="swapSlot" @set-borrowed="setBorrowed"></CharacterBuild>
            <CharacterBuild v-if="teamBuild.strikers[4]" :character="pickedChars[teamBuild.strikers[4]]" :id="pickedChars[teamBuild.strikers[4]].ElementId" :shared="props.shared" @swap-slot="swapSlot" @set-borrowed="setBorrowed"></CharacterBuild>
            <CharacterBuild v-if="teamBuild.specials[1]" :character="pickedChars[teamBuild.specials[1]]" :id="pickedChars[teamBuild.specials[1]].ElementId" :shared="props.shared" @swap-slot="swapSlot" @set-borrowed="setBorrowed"></CharacterBuild>
            <CharacterBuild v-if="teamBuild.specials[2]" :character="pickedChars[teamBuild.specials[2]]" :id="pickedChars[teamBuild.specials[2]].ElementId" :shared="props.shared" @swap-slot="swapSlot" @set-borrowed="setBorrowed"></CharacterBuild>
        </div>
    </div>
</template>

<style>
.team-builder .character-search-list ul.character-search-wrapper
{
    list-style: none;
    padding-left: 0;
    max-height: 322px;
    overflow: hidden;
}

.team-builder .character-search-list .character-select
{
    height: 58px;
    margin: 5px 0;
    color: #ffffff;
    line-height: 42px;
    padding-left: 25px;
    font-size: 48px;
    border: 1px solid white;
    border-radius: 20px;
    cursor: pointer;
}

.team-builder .character-search-list .character-select.character-striker
{
    background-color: #BC302E;
}

.team-builder .character-search-list .character-select.character-special
{
    background-color: #2C69F6;
}

.team-builder .character-search-list .character-portrait
{
    max-height: 48px;
    display: inline-block;
    margin-bottom: 12px;
}
.team-builder .character-search-list .character-name
{
    padding: 5px;
    display: inline-block;
}

.team-builder .character-search-list .already-selected
{
    background-color: #cccccc;
    filter: grayscale(100%);
}

.team-builder .characters-picked .character-wrapper
{
    width: 280px;
    height: 316px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(4, 70px);
    grid-template-rows: 40px 40px auto 40px;
    background-size: 280px 316px !important;
    border-radius: 5px;
}

.team-builder .characters-picked .character-wrapper.character-damagetype-explosive
{
    box-shadow: 0px 0px 5px 5px var(--damagetype-red);
}

.team-builder .characters-picked .character-wrapper.character-damagetype-piercing
{
    box-shadow: 0px 0px 5px 5px var(--damagetype-yellow);
}

.team-builder .characters-picked .character-wrapper.character-damagetype-mystic
{
    box-shadow: 0px 0px 5px 5px var(--damagetype-blue);
}

.team-builder .characters-picked .character-wrapper.character-borrowed
{
    position: relative;
}

.team-builder .characters-picked .character-wrapper.character-borrowed::after
{
    content: 'BORROWED';
    position: absolute;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    top: 80px;
    width: 280px;
    background: black;
    text-align: center;
}

.team-builder .characters-picked .character-wrapper .character-settings,
.team-builder .characters-picked .character-wrapper .character-name,
.team-builder .characters-picked .character-wrapper .character-rarity,
.team-builder .characters-picked .character-wrapper .character-level
{
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 30px;
}

.team-builder .characters-picked .character-wrapper .character-settings
{
    grid-column: 1 / 2;
}

.team-builder .characters-picked .character-wrapper .character-name
{
    grid-column: 2 / 4;
    color: #ffffff;
    font-weight: bold;
    -webkit-text-stroke: 1px #000000;
    text-stroke: 1px #000000;
}

.team-builder .characters-picked .character-wrapper .character-level
{
    grid-column: 4 / 5;
    color: #ffffff;
    font-weight: bold;
    -webkit-text-stroke: 1px #ffffff;
    text-stroke: 1px #ffffff;
}

.team-builder .characters-picked .character-wrapper .character-rarity
{
    grid-column: 1 / 5;
}

.team-builder .characters-picked .character-wrapper .character-rarity img
{
    max-height: 30px;
    display: inline-block;
    margin-bottom: 10px;
}

.team-builder .characters-picked .character-wrapper .character-rarity img.unique-weapon
{
    filter: hue-rotate(150deg);
}

.team-builder .characters-picked .character-wrapper .character-bond,
.team-builder .characters-picked .character-wrapper .character-equipment
{
    background-position: center !important;
    background-repeat: no-repeat !important;
    align-self: end;
    text-align: center;
    font-size: 30px;
    background: rgba(0, 0, 0, 0.5);
    margin-bottom: 5px;
    color: #ffffff;
    font-weight: bold;
    -webkit-text-stroke: 1px #000000;
    text-stroke: 1px #000000;
}

.team-builder .characters-picked .character-wrapper .character-bond
{
    background-size: 50px 40px !important;
}

.team-builder .characters-picked .character-wrapper .character-equipment
{
    background-size: 63px 50px !important;
    filter: grayscale(100%);
}

.team-builder .characters-picked .character-wrapper .character-skill
{
    align-self: end;
    text-align: center;
    font-size: 30px;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
}

.team-builder .characters-picked .character-wrapper .selector-dropdown a,
.team-builder .characters-picked .character-wrapper .selector-dropdown a:visited
{
    text-decoration: none;
    color: #ffffff;
    font-weight: bold;
    -webkit-text-stroke: 1px #000000;
    cursor: pointer;
}

.team-builder .characters-picked .character-wrapper .selector-dropdown a.dropdown-item,
.team-builder .characters-picked .character-wrapper .selector-dropdown a.dropdown-item:visited
{
    color: #000000;
}

.team-builder .characters-picked .character-wrapper .selector-dropdown .number-input
{
    min-width: 0;
    width: 70px;
    max-height: 400px;
    overflow-y: auto;
}

.team-builder .characters-picked .character-wrapper .selector-dropdown.character-settings .dropdown-menu li
{
    padding-left: 10px;
}

.team-builder .characters-picked .character-wrapper .selector-dropdown.character-settings .dropdown-menu a
{
    color: #000000;
    -webkit-text-stroke: 0;
    text-stroke: 0;
}


@media (min-width: 1200px)
{

    .team-builder .characters-picked
    {
        display: grid;
        grid-template-columns: repeat(4, 300px);
    }

    #character-striker-1
    {
        grid-column-start: 1;
        grid-row-start: 1;
    }

    #character-striker-2
    {
        grid-column-start: 2;
        grid-row-start: 1;
    }

    #character-striker-3
    {
        grid-column-start: 3;
        grid-row-start: 1;
    }

    #character-striker-4
    {
        grid-column-start: 4;
        grid-row-start: 1;
    }

    #character-special-1
    {
        grid-column: 2 / 3;
        grid-row-start: 2;
    }

    #character-special-2
    {
        grid-column: 3 / 5;
        grid-row-start: 2;
    }
}

@media (min-width: 600px) and (max-width: 1199px)
{
    .team-builder .characters-picked
    {
        display: grid;
        grid-template-columns: repeat(2, 300px);
    }

    #character-striker-1
    {
        grid-column-start: 1;
        grid-row-start: 1;
    }

    #character-striker-2
    {
        grid-column-start: 2;
        grid-row-start: 1;
    }

    #character-striker-3
    {
        grid-column-start: 1;
        grid-row-start: 2;
    }

    #character-striker-4
    {
        grid-column-start: 2;
        grid-row-start: 2;
    }

    #character-special-1
    {
        grid-column-start: 1;
        grid-row-start: 3;
    }

    #character-special-2
    {
        grid-column-start: 2;
        grid-row-start: 3;
    }
}

</style>
