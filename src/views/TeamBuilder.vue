<script setup>
import { ref, shallowRef } from 'vue';
import { useTeamStorage } from '../stores/TeamStorage.js';

import TeamBuilder from '../components/TeamBuilder.vue';

function createNewTeam()
{
    componentName.value = TeamBuilder;
    topControls.value = false;
    innerControls.value = true;
}

function loadTeam(name, hash)
{
    oldTeamName.value = name;
    teamName.value = name;
    teamHash.value = hash;
    createNewTeam();
}

function saveTeam()
{
    if(oldTeamName.value && oldTeamName.value != teamName.value)
    {
        delete teamStorage.team[oldTeamName.value];
    }
    oldTeamName.value = '';
    teamStorage.team[teamName.value] = teamHash.value;
    cancelTeam();
}

function cancelTeam()
{
    componentName.value = 'template';
    topControls.value = true;
    innerControls.value = false;
    teamName.value = '';
    teamHash.value = '';
}

const teamStorage = useTeamStorage();
const componentName = shallowRef('template');
const topControls = ref(true);
const innerControls = ref(false);
const oldTeamName = ref('');
const teamName = ref('');
const teamHash = ref('');


</script>

<template>
    <div>
        <div class="controls" v-if="topControls">
            <input @click="createNewTeam()" class="btn btn-primary" type="button" value="Create New Team">
        </div>
        <div class="controls row" v-if="innerControls">
            <div class="col-1">
                <input @click="saveTeam()" class="btn btn-primary col-auto" type="button" value="Save Team" :disabled="teamName.length === 0">
            </div>
            <div class="col-2">
                <input v-model="teamName" class="form-control" placeholder="Team Name">
            </div>
            <div class="col-2 offset-md-7" style="text-align: right;">
                <input @click="cancelTeam()" class="btn btn-danger col-auto" type="button" value="Cancel Team Building">
            </div>
        </div>
        <component :is="componentName" v-model:teamHash="teamHash"></component>
        <div v-if="topControls">
            Existing Teams:
            <ul>
                <li v-for="(value, key) in teamStorage.team" @click="loadTeam(key, value)">
                    <b>{{key}}</b>
                </li>
            </ul>
        </div>
    </div>
</template>
