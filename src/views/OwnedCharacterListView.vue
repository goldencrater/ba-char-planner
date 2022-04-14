<script setup>
import { ref } from 'vue';

import CharacterSearch from '../components/CharacterSearch.vue';
import CharacterBuild from '../components/CharacterBuild.vue';

const sortedList = ref([]);

sortedList.value.sort((a, b) => {
    return a.Name > b.Name ? 1 : -1;
})

function updateList(newList)
{
    newList.sort((a, b) => {
        return a.Name > b.Name ? 1 : -1;
    });
    sortedList.value = newList;
}

</script>

<template>
    <div class="form-floating">
        <CharacterSearch @update-list="updateList" id="characterSearch" class="form-control"></CharacterSearch>
        <label for="characterSearch">Character Name</label>
    </div>
    <div class="owned-character-list">
        <div v-for="character in sortedList" class="character">
            <CharacterBuild :character="character"></CharacterBuild>
        </div>
    </div>
</template>

<style>
.owned-character-list
{
    display: grid;
    grid-template-columns: repeat(4, 300px);
}

.owned-character-list .character-wrapper
{
    width: 280px;
    height: 316px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(4, 70px);
    grid-template-rows: 40px 40px auto 40px;
    background-size: 280px 316px !important;
}

.owned-character-list .character-wrapper .character-settings,
.owned-character-list .character-wrapper .character-name,
.owned-character-list .character-wrapper .character-rarity,
.owned-character-list .character-wrapper .character-level
{
    background: rgba(0, 0, 0, 0.5);
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-size: 30px;
}

.owned-character-list .character-wrapper .character-ue
{
    grid-column: 1 / 2;
}

.owned-character-list .character-wrapper .character-name
{
    grid-column: 2 / 4;
    color: #000000;
    font-weight: bold;
}

.owned-character-list .character-wrapper .character-level
{
    grid-column: 4 / 5;
    color: #000000;
    font-weight: bold;
    -webkit-text-stroke: 1px white;
    text-stroke: 1px white;
}

.owned-character-list .character-wrapper .character-rarity
{
    grid-column: 1 / 5;
}

.owned-character-list .character-wrapper .character-rarity img
{
    max-height: 30px;
    display: inline-block;
    margin-bottom: 10px;
}

.owned-character-list .character-wrapper .character-bond,
.owned-character-list .character-wrapper .character-equipment
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

.owned-character-list .character-wrapper .character-bond
{
    background-size: 50px 40px !important;
}

.owned-character-list .character-wrapper .character-equipment
{
    background-size: 63px 50px !important;
    filter: grayscale(100%);
}

.owned-character-list .character-wrapper .character-skill
{
    align-self: end;
    text-align: center;
    font-size: 30px;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
}

.owned-character-list .character-wrapper .selector-dropdown a,
.owned-character-list .character-wrapper .selector-dropdown a:visited
{
    text-decoration: none;
    color: #ffffff;
    font-weight: bold;
    -webkit-text-stroke: 1px #000000;
}

.owned-character-list .character-wrapper .selector-dropdown a.dropdown-item,
.owned-character-list .character-wrapper .selector-dropdown a.dropdown-item:visited
{
    color: #000000;
}

.owned-character-list .character-wrapper .selector-dropdown .number-input
{
    min-width: 0;
    width: 70px;
    max-height: 400px;
    overflow-y: auto;
}

.owned-character-list .character-wrapper .selector-dropdown.character-settings .dropdown-menu li
{
    padding-left: 10px;
}

.owned-character-list .character-wrapper .selector-dropdown.character-settings .dropdown-menu a
{
    color: #000000;
    -webkit-text-stroke: 0;
    text-stroke: 0;
}
</style>
