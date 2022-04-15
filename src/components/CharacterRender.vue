<script setup>
import Affinities from './Affinities.vue';
import CharacterSkillPane from './CharacterSkillPane.vue';

defineProps({
    character: {
        type: Object,
        required: true
    },
});
</script>

<template>
    <div class="character">
        <div class="character-profile">
            <div class="image">
                <img :src="'/import/Character/' + character.Icon + '.png'" :alt="character.Name">
            </div>
            <div class="rarity">
                <img :src="'/images/star-lit.png'">
                <img :src="'/images/star-lit.png'" v-if="character.BaseStar > 1">
                <img :src="'/images/star-lit.png'" v-if="character.BaseStar > 2">
            </div>
            <div class="name">
                <h1>{{$tC(character.Id, 'Name')}}</h1>
            </div>
            <div :class="'type type-' + character.Type.toLowerCase()">
                {{character.Type}}
            </div>
            <div class="school">
                <img :src="'/import/Icons/' + character.School + '.png'" :alt="character.School">
                <span>{{character.School}}</span>
            </div>
            <div :class="'damagetype damagetype-' + character.DamageType.toLowerCase()">
                <div class="title">
                    Damage Type
                </div>
                <span class="content">{{character.DamageType}}</span>
            </div>
            <div :class="'defensetype defensetype-' + character.DefenseType.toLowerCase()">
                <div class="title">
                    Defense Type
                </div>
                <span class="content">{{character.DefenseType}}</span>
            </div>
            <div class="affinities">
                <div class="title">
                    Affinities
                </div>
                <Affinities type="urban" :rating="character.Affinities.Urban"></Affinities>
                <Affinities type="outdoors" :rating="character.Affinities.Outdoors"></Affinities>
                <Affinities type="indoors" :rating="character.Affinities.Indoors"></Affinities>
            </div>
            <div class="equipment equipment-slot1 border">
                <img :src="'/import/Equipment/Equipment_Icon_' + character.Equipment.Slot1 + '_Tier1.png'" :alt="character.Equipment.Slot1">
                <span>{{character.Equipment.Slot1}}</span>
            </div>
            <div class="equipment equipment-slot2 border">
                <img :src="'/import/Equipment/Equipment_Icon_' + character.Equipment.Slot2 + '_Tier1.png'" :alt="character.Equipment.Slot2">
                <span>{{character.Equipment.Slot2}}</span>
            </div>
            <div class="equipment equipment-slot3 border">
                <img :src="'/import/Equipment/Equipment_Icon_' + character.Equipment.Slot3 + '_Tier1.png'" :alt="character.Equipment.Slot3">
                <span>{{character.Equipment.Slot3}}</span>
            </div>
        </div>
        <CharacterSkillPane :character="character"></CharacterSkillPane>
    </div>
</template>
