<script setup>
import { ref, shallowRef } from 'vue';
import { useTeamStorage } from '../stores/TeamStorage.js';
import { useRouter } from 'vue-router';
import { getCharacterById } from '../composables/Character.js';

import TeamBuilder from '../components/TeamBuilder.vue';

function createNewTeam()
{
    componentName.value = TeamBuilder;
    topControlsVisible.value = false;
    innerControlsVisible.value = true;
    teamListVisible.value = false;
}

function loadTeam(name, hash, shared = false)
{
    oldTeamName.value = name;
    teamName.value = name;
    teamHash.value = hash;
    if(name.substring(name.length - 8) === '(Shared)')
    {
        shared = true;
    }
    teamShared.value = shared;
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
    topControlsVisible.value = true;
    innerControlsVisible.value = false;
    teamListVisible.value = true;
    teamName.value = '';
    teamHash.value = '';
}

function shareTeam(sharedTeamName)
{
    let sharedTeamHash = '#' + teamStorage.team[sharedTeamName];
    sharedTeamHash += sharedTeamName;

    let url = router.resolve({
        name: 'teambuilder-share',
        hash: sharedTeamHash
    });

    shareTeamLink.value = document.location.origin + url.href;
    shareTeamVisible.value = true;
    topControlsVisible.value = false;
    teamListVisible.value = false;
}

function shareTeamBack()
{
    shareTeamLink.value = '';
    copyMessage.value = '';
    shareTeamVisible.value = false;
    topControlsVisible.value = true;
    teamListVisible.value = true;
}

function shareTeamCopy()
{
    copyMessage.value = '';
    navigator.clipboard.writeText(shareTeamLink.value).then(() =>{
        copyMessage.value = 'Copied to clipboard';
    }, () => {
        copyMessage.value = 'Error copying to clipboard';
    });
}

function deleteTeamPrompt(selectedTeamName)
{
    teamName.value = selectedTeamName;
}

function deleteTeam(selectedTeamName)
{
    delete teamStorage.team[selectedTeamName];
    teamName.value = '';
}

function generateTeamImageArray(selectedTeamName)
{
    const selectedTeam = teamStorage.team[selectedTeamName];
    const entries = selectedTeam.split(';');
    const imgUrls = [];
    for (let i = 0; i <= 5; i++)
    {
        if(entries[i] === 'n')
        {
            continue;
        }
        let charId = entries[i].split('|', 1)[0];
        let character = getCharacterById(charId);
        imgUrls.push("/import/Character/" + character.Icon + ".png");
    }
    return imgUrls;
}

const teamStorage = useTeamStorage();
const componentName = shallowRef('template');
const router = useRouter();

const oldTeamName = ref('');
const teamName = ref('');
const teamHash = ref('');
const teamShared = ref(false);
const shareTeamLink = ref('');
const copyMessage = ref('');

// Visibility
const topControlsVisible = ref(true);
const innerControlsVisible = ref(false);
const shareTeamVisible = ref(false);
const teamListVisible = ref(true);

if(router.currentRoute.value.name == 'teambuilder-share')
{
    const shareHashBits = router.currentRoute.value.hash.split(';');
    router.replace({name: 'teambuilder'});
    loadTeam(shareHashBits[7] + ' (Shared)', router.currentRoute.value.hash.substring(1), true);
}

</script>

<template>
    <div class="team-builder-wrapper">
        <div class="controls" v-if="topControlsVisible">
            <input @click="createNewTeam()" class="btn btn-primary" type="button" value="Create New Team">
        </div>
        <div class="controls row" v-if="innerControlsVisible">
            <div class="col-1">
                <input @click="saveTeam()" class="btn btn-primary col-auto" type="button" value="Save Team" :disabled="teamName.length === 0">
            </div>
            <div class="col-2">
                <input v-model="teamName" class="form-control" placeholder="Team Name">
            </div>
            <div class="col-2 offset-md-7" style="text-align: right;">
                <input @click="cancelTeam()" class="btn btn-danger col-auto" type="button" value="Cancel">
            </div>
        </div>
        <div class="share-team" v-if="shareTeamVisible">
            <div class="btn-group">
                <input @click="shareTeamBack()" class="btn btn-primary" type="button" value="Back">
            </div>
            <div class="form-floating">
                <input @focus="$event.target.select()" v-model="shareTeamLink" readonly class="form-control" id="team-share-input">
                <label for="team-share-input">Share URL</label>
            </div>
            <div class="btn-group">
                <input @click="shareTeamCopy()" class="btn btn-primary" type="button" value="Copy to Clipboard">
            </div>
            <div v-if="copyMessage">
                {{copyMessage}}
            </div>
        </div>
        <component :is="componentName" v-model:teamHash="teamHash" :shared="teamShared"></component>
        <div v-if="teamListVisible" class="team-list">
            Existing Teams:
            <ul class="list-group">
                <li v-for="(storedTeamHash, storedTeamName) in teamStorage.team" @click="loadTeam(storedTeamName, storedTeamHash)" class="list-group-item stored-team" :key="storedTeamName">
                    <div class="team-members-list">
                        <img v-for="image in generateTeamImageArray(storedTeamName)" :src="image">
                    </div>
                    <span class="team-name">{{storedTeamName}}</span>
                    <div class="dropdown team-list-options">
                        <button @click.stop class="btn btn-secondary dropdown-toggle" type="button" :id="'dropdown-' + storedTeamName.replace(' ', '_')" data-bs-toggle="dropdown" aria-expanded="false">
                            Options
                        </button>
                        <ul class="dropdown-menu" :aria-labelledby="'dropdown-' + storedTeamName.replace(' ', '_')">
                            <li><a class="dropdown-item" @click.stop="shareTeam(storedTeamName)">Share</a></li>
                            <li><a class="dropdown-item" @click.stop="deleteTeamPrompt(storedTeamName)" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">Delete Team</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Delete Team {{teamName}}? This cannot be undone
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" @click="deleteTeam(teamName)" data-bs-dismiss="modal">Delete</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.team-builder-wrapper .team-list .team-name
{
    font-weight: bold;
    font-size: 36px;
    line-height: 57px;
    height: 57px;
    display: inline-block;
    vertical-align: middle;
}

.team-builder-wrapper .team-list .team-list-options
{
    display: inline-block;
    float: right;
}

.team-builder-wrapper .team-list .team-list-options button
{
    height: 57px;
}

.team-builder-wrapper .share-team input
{
    margin-bottom: 5px;
}

.team-builder-wrapper .team-list .team-members-list
{
    display: inline-block;
    margin-right: 10px;
}

.team-builder-wrapper .team-list .team-members-list img
{
    height: 57px;
}
</style>
