<script setup>
import { ref } from 'vue'

import { useSettingsStorage } from '../stores/SettingsStorage.js';
import { useCharacterStorage } from '../stores/CharacterStorage.js';
import { useTeamStorage } from '../stores/TeamStorage.js'
import { getCharacterById, hashCharStats, unhashCharStats } from '../composables/Character.js'


const settingsStorage = useSettingsStorage();
const settings = settingsStorage.settings;
const language = ref(settings.Language);
const jpOnly = ref(settings.IncludeJpOnly ? 'Yes' : 'No');

const characterStorage = useCharacterStorage();
const characters = characterStorage.characters;

const teamStorage = useTeamStorage();
const teams = teamStorage.teams;

const displayTextContent = ref(false);
const textContentNote = ref('');
const textContent = ref('');
const textContentReadOnly = ref(false);
const displayImportButton = ref(false);
const errorMessage = ref('');
let importType = '';

function saveSettings()
{
    if(settings.Language != language.value)
    {
        settings.Language = language.value;
    }
    settings.IncludeJpOnly = (jpOnly.value === 'Yes');
}

function restartApp()
{
    window.location.reload();
}

function calculateChecksum(outputObject)
{
    let checksumBase = JSON.stringify(outputObject);
    let checksum = 0;
    for(var i = 0; i < checksumBase.length; i++)
    {
        checksum += checksumBase.charCodeAt(i);
    }
    return checksum % 65536;
}

function exportData()
{
    const outputObject = {
        characters: [],
        teams: teams,
        checksum: '',
    };
    Object.values(characters).forEach((value) =>
    {
        outputObject.characters.push(hashCharStats(value));
    });
    outputObject.checksum = calculateChecksum(outputObject);

    textContentNote.value = '';
    textContent.value = JSON.stringify(outputObject);
    textContentReadOnly.value = true;
    displayTextContent.value = true;
    displayImportButton.value = false;
    errorMessage.value = '';
}

function importData(type)
{
    importType = type;
    textContentNote.value = 'This will merge the import data with existing data. If you wish to replace the existing data, click Clear Data first.';
    textContent.value = '';
    textContentReadOnly.value = false;
    displayTextContent.value = true;
    displayImportButton.value = true;
    errorMessage.value = '';
}

function processImport()
{
    let importedData = null;
    try
    {
        importedData = JSON.parse(textContent.value);
    }
    catch (e)
    {
        errorMessage.value = 'Error processing input. Check that you have copy/pasted the full data.';
        return;
    }
    switch(importType)
    {
        case 'ours':
        {
            processDataOurs(importedData);
            return;
        }
        case 'justin':
        {
            processDataJustin(importedData);
            return;
        }
        default:
        {
            errorMessage.value = 'Invalid import';
            return;
        }
    }
}

function processDataOurs(importedData)
{
    if(typeof(importedData.characters) === 'undefined')
    {
        errorMessage.value = 'Character data missing.';
        return;
    }
    if(typeof(importedData.teams) === 'undefined')
    {
        errorMessage.value = 'Team data missing.';
        return;
    }
    if(typeof(importedData.checksum) === 'undefined')
    {
        errorMessage.value = 'Checksum data missing.';
        return;
    }
    let inputChecksum = importedData.checksum;
    importedData.checksum = '';
    if(inputChecksum !== calculateChecksum(importedData))
    {
        errorMessage.value = "Checksum validation failed. Check you haven't altered the data and try again.";
        return;
    }
    importedData.characters.forEach((dataString) => {
        const importSettings = unhashCharStats(dataString);
        const character = getCharacterById(importSettings.Id, false);
        const charSettings = characterStorage.addCharacter(character);
        for(const [key, value] of Object.entries(importSettings))
        {
            charSettings[key] = value;
        }
    })
    for(const [key, value] of Object.entries(importedData.teams))
    {
        teams[key] = value;
    }
    const modalElement = document.getElementById('settingsModal')
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function processDataJustin(importedData)
{
    importedData.characters.forEach((charStats) => {
        const character = getCharacterById(charStats.id, false);
        const charSettings = characterStorage.addCharacter(character);
        charSettings.Stars = parseInt(charStats.current.star);
        let ueStars = Math.max(charStats.current.ue - 1, 0);
        charSettings.Stars += ueStars;
        charSettings.Bond = parseInt(charStats.current.bond);
        charSettings.Level = parseInt(charStats.current.level);
        charSettings.WeaponLevel = parseInt(charStats.current.ue_level);
        charSettings.SkillEx = parseInt(charStats.current.ex);
        charSettings.Skill1 = parseInt(charStats.current.basic);
        charSettings.Skill2 = parseInt(charStats.current.passive);
        charSettings.Skill3 = parseInt(charStats.current.sub);
        charSettings.Equip1 = parseInt(charStats.current.gear1);
        charSettings.Equip2 = parseInt(charStats.current.gear2);
        charSettings.Equip3 = parseInt(charStats.current.gear3);
    });

    const modalElement = document.getElementById('settingsModal')
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function clearData()
{
    characterStorage.characters = {};
    teamStorage.teams = {};
    settingsStorage.reset();

    const modalElement = document.getElementById('settingsModal')
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

</script>

<template>
    <div class="settings-wrapper">
        <div>
            <div class="settings-button settings-confirm">
                <input @click="saveSettings()" class="btn btn-success" type="button" value="Save Settings" data-bs-toggle="modal" data-bs-target="#settingsModal">
            </div>
            <div class="settings">
                <label for="languageDropdown" class="form-label">Language</label>
                <select v-model="language" id="languageDropdown" class="form-control">
                    <option value="En">English</option>
                    <option value="Jp">Japanese</option>
                    <option value="Kr">Korean</option>
                    <option value="Tw">Traditional Chinese</option>
                    <option value="Th">Thai</option>
                </select>
            </div>
            <div class="settings">
                <label for="jpOnlyDropdown" class="form-label">Enable JP Only Content (warning: may be untranslated)</label>
                <select v-model="jpOnly" id="jpOnlyDropdown" class="form-control">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>
            <div class="settings data-management">
                <span>Data Management</span>
                <div class="form-control">
                    <input type="button" class="btn btn-secondary" value="Export Data" @click="exportData">
                    <input type="button" class="btn btn-secondary" value="Import Data" @click="importData('ours')">
                    <input type="button" class="btn btn-secondary" value="Import Data from Justin's Resource Planner" @click="importData('justin')">

                    <input type="button" class="btn btn-danger btn-clear-data" value="Clear Data" data-bs-toggle="modal" data-bs-target="#deleteModal">
                </div>
                <div class="form-control" v-if="displayTextContent">
                    <span class="textContentNote">{{textContentNote}}</span>
                    <textarea class="form-control import-export-textarea" @focus="$event.target.select()" :readonly="textContentReadOnly" v-model="textContent"></textarea>
                </div>
                <div class="settings-button">
                    <input @click="processImport()" class="btn btn-success" type="button" value="Import Data" v-if="displayImportButton">
                    <span class="error-message" v-if="errorMessage">{{errorMessage}}</span>
                </div>
            </div>
        </div>

        <div class="modal fade" id="settingsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="settingsModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="settingsModalLabel">Settings Saved</h5>
                    </div>
                    <div class="modal-body">
                        Settings Saved. App will now restart.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="restartApp()">Restart App</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Clear All Data</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Clear all User Data? This cannot be undone.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="clearData()" data-bs-dismiss="modal">Clear All Data</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.settings-wrapper .settings-button
{
    padding: 0 10px;
}

.settings-wrapper .settings
{
    border: 1px solid black;
    border-radius: 10px;
    margin: 5px 0;
    padding: 10px;
}

.settings-wrapper .data-management .btn
{
    margin-right: 5px;
}

.settings-wrapper .data-management .btn-clear-data
{
    float: right;
    margin: 0;
}

.settings-wrapper .data-management .import-export-textarea
{
    height: 100px;
}

.settings-wrapper .data-management .form-control
{
    margin-bottom: 5px;
}

.settings-wrapper .data-management .error-message
{
    color: #ff0000;
}
</style>
