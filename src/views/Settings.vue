<script setup>
import { ref } from 'vue'

import { useSettingsStorage } from '../stores/SettingsStorage.js';

const settingsStorage = useSettingsStorage();
const settings = settingsStorage.settings;
const language = ref(settings.Language);
const jpOnly = ref(settings.IncludeJpOnly ? 'Yes' : 'No');

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
</script>

<template>
    <div class="settings-wrapper">
        <div>
            <div>
                <input @click="saveSettings()" class="btn btn-success" type="button" value="Save Settings" data-bs-toggle="modal" data-bs-target="#settingsModal">
            </div>
            <div>
                <label for="languageDropdown" class="form-label">Language</label>
                <select v-model="language" id="languageDropdown" class="form-control">
                    <option value="En">English</option>
                    <option value="Jp">Japanese</option>
                    <option value="Kr">Korean</option>
                    <option value="Tw">Traditional Chinese</option>
                    <option value="Th">Thai</option>
                </select>
            </div>
            <div>
                <label for="jpOnlyDropdown" class="form-label">Enable JP Only Content (warning: may be untranslated)</label>
                <select v-model="jpOnly" id="jpOnlyDropdown" class="form-control">
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
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
    </div>
</template>
