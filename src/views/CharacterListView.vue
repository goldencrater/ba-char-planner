<script setup>
import { ref } from 'vue';

import CharacterSearch from '../components/CharacterSearch.vue';

const sortedList = ref([]);

sortedList.value.sort((a, b) => {
    return a.Name > b.Name ? 1 : -1;
})

function createBackgroundTag(path)
{
    return 'background-image: url("/import/Character/' + path + '.png")'
}

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
    <div class="character-list">
        <div v-for="character in sortedList" class="character">
            <RouterLink :to="{name: 'charview', params: {charid: character.Name.toLowerCase() }}">
                <div :style="createBackgroundTag(character.Icon)" class="character-link-wrapper">
                    <div class="character-stars">
                        <img :src="'/images/star-lit.png'">
                        <img :src="'/images/star-lit.png'" v-if="character.BaseStar > 1">
                        <img :src="'/images/star-lit.png'" v-if="character.BaseStar > 2">
                    </div>
                    <div class="character-school">
                        <img :src="'/import/Icons/' + character.School + '.png'" :alt="character.School">
                    </div>
                    <div :class="'character-attack damagetype-' + character.DamageType.toLowerCase()"></div>
                    <div :class="'character-defense defensetype-' + character.DefenseType.toLowerCase()"></div>
                    <div class="character-name">
                        {{$tC(character.Id, 'Name')}}
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<style>
.character-list
{
    display: grid;
    grid-template-columns: repeat(5, 150px);
}

.character-list a
{
    text-decoration: none;
}

.character-list .character-link-wrapper
{
    width: 132px;
    height: 150px;
    background-size: 132px 150px;
    margin: 10px;
    display: grid;
    grid-template-columns: 30px auto 30px;
    grid-template-rows: 30px auto 46px;
}

.character-list .character-link-wrapper .character-stars
{
    grid-column-start: 1;
    grid-column-end: 4;
    height: 30px;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
}

.character-list .character-link-wrapper .character-stars img
{
    max-height: 25px;
}

.character-list .character-link-wrapper .character-school img
{
    max-width: 40px;
}

.character-list .character-link-wrapper .character-name
{
    grid-row-start: 3;
    grid-column-start: 2;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    text-decoration: none;
}

.character-list .character-link-wrapper .character-attack
{
    grid-row-start: 3;
    grid-column-start: 3;
    height: 31px;
    width: 28px;
    mask-image: url("/images/Attack.png");
    -webkit-mask-image: url("/images/Attack.png");
    margin: 2px;
    align-self: end;
}

.character-list .character-link-wrapper .character-defense
{
    grid-row-start: 3;
    grid-column-start: 1;
    height: 31px;
    width: 28px;
    mask-image: url("/images/Defense.png");
    -webkit-mask-image: url("/images/Defense.png");
    margin: 2px;
    align-self: end;
}

.character-list .character-link-wrapper .damagetype-explosive,
.character-list .character-link-wrapper .defensetype-light
{
    background-color: #930008;
    color: #ffffff;
}

.character-list .character-link-wrapper .damagetype-piercing,
.character-list .character-link-wrapper .defensetype-heavy
{
    background-color: #bf8901;
    color: #ffffff;
}

.character-list .character-link-wrapper .damagetype-mystic,
.character-list .character-link-wrapper .defensetype-special
{
    background-color: #226f9c;
    color: #ffffff;
}
</style>
