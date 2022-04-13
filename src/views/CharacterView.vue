<script setup>
import { useRoute } from 'vue-router';
import { getCharacterByName, getCharacterById } from '../composables/Character.js';

import CharacterRender from '../components/CharacterRender.vue';


const route = useRoute();
const characterId = route.params.charid;
let character;
if(parseInt(characterId).toString() === characterId)
{
    character = getCharacterById(characterId);
}
else
{
    character = getCharacterByName(characterId);
}

console.log(character);

</script>

<template>
    <div class="backlink">
        <RouterLink :to="{name: 'charlist'}" class="nav-link">Back</RouterLink>
    </div>
    <CharacterRender :character="character"></CharacterRender>
</template>

<style>
@import '../assets/character.css';
@import '../assets/affinity.css';
</style>
