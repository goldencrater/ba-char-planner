<script setup>
import Affinities from './Affinities.vue';
import CharacterSkillPane from './CharacterSkillPane.vue';

const props = defineProps({
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
                <img :src="'/import/Character/' + props.character.Icon + '.png'" :alt="props.character.Name">
            </div>
            <div class="rarity">
                <img :src="'/images/star-lit.png'">
                <img :src="'/images/star-lit.png'" v-if="props.character.BaseStar > 1">
                <img :src="'/images/star-lit.png'" v-if="props.character.BaseStar > 2">
            </div>
            <div class="name">
                <h1>{{props.character.Name}}</h1>
            </div>
            <div :class="'type type-' + props.character.Type.toLowerCase()">
                {{props.character.Type}}
            </div>
            <div class="school">
                <img :src="'/import/Icons/' + props.character.School + '.png'" :alt="props.character.School">
                <span>{{props.character.School}}</span>
            </div>
            <div :class="'damagetype damagetype-' + props.character.DamageType.toLowerCase()">
                <div class="title">
                    Damage Type
                </div>
                <span class="content">{{props.character.DamageType}}</span>
            </div>
            <div :class="'defensetype defensetype-' + props.character.DefenseType.toLowerCase()">
                <div class="title">
                    Defense Type
                </div>
                <span class="content">{{props.character.DefenseType}}</span>
            </div>
            <div class="affinities">
                <div class="title">
                    Affinities
                </div>
                <Affinities type="urban" :rating="props.character.Affinities.Urban"></Affinities>
                <Affinities type="outdoors" :rating="props.character.Affinities.Outdoors"></Affinities>
                <Affinities type="indoors" :rating="props.character.Affinities.Indoors"></Affinities>
            </div>
            <div class="equipment equipment-slot1 border">
                <img :src="'/import/Equipment/Equipment_Icon_' + props.character.Equipment.Slot1 + '_Tier1.png'" :alt="props.character.Equipment.Slot1">
                <span>{{props.character.Equipment.Slot1}}</span>
            </div>
            <div class="equipment equipment-slot2 border">
                <img :src="'/import/Equipment/Equipment_Icon_' + props.character.Equipment.Slot2 + '_Tier1.png'" :alt="props.character.Equipment.Slot2">
                <span>{{props.character.Equipment.Slot2}}</span>
            </div>
            <div class="equipment equipment-slot3 border">
                <img :src="'/import/Equipment/Equipment_Icon_' + props.character.Equipment.Slot3 + '_Tier1.png'" :alt="props.character.Equipment.Slot3">
                <span>{{props.character.Equipment.Slot3}}</span>
            </div>
        </div>
        <CharacterSkillPane :character="props.character"></CharacterSkillPane>
    </div>
</template>
