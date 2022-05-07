<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useSettingsStorage } from './stores/SettingsStorage.js';

const settings = useSettingsStorage();
console.log(settings.settings.ColourMode);
if(typeof(settings.settings.ColourMode) === 'undefined')
{
    settings.settings.ColourMode = 'auto';
}

switch(settings.settings.ColourMode)
{
    case 'auto':
    {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        {
            document.body.className = "darkmode";
        }
        break;
    }
    case 'dark':
    {
        document.body.className = "darkmode";
        break;
    }
    case 'light':
    {
        break;
    }
}


// eslint-disable-next-line no-undef
const commithash = __COMMITHASH__

</script>

<template>
    <header class="container-xxl">
        <nav class="navbar navbar-expand-xxl">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="navbar-nav">
                    <RouterLink to="/" class="nav-link">Home</RouterLink>
                    <RouterLink to="/char" class="nav-link">Character Search</RouterLink>
                    <RouterLink to="/team" class="nav-link">Team Builder</RouterLink>
                    <RouterLink to="/scorecalc" class="nav-link">Raid Score Calc</RouterLink>
                </div>
            </div>
            <RouterLink to="/settings" class="nav-link navbar-setting"><font-awesome-icon icon="gear"></font-awesome-icon></RouterLink>
        </nav>
    </header>

    <div class="main-content container-xxl">
        <RouterView></RouterView>
    </div>

    <footer class="footer">
        <div class="container-xxl">
            HashRef : {{commithash}}
        </div>
    </footer>

</template>

<style>
@import './assets/style.css';
@import './assets/colours.css';

.navbar .navbar-setting
{
    float: right;
}
</style>
