<script setup>
import { RouterLink, RouterView } from 'vue-router';

// eslint-disable-next-line no-undef
const commithash = __COMMITHASH__
</script>

<template>
    <header class="container-xxl">
        <nav class="navbar navbar-expand-xxl navbar-light bg-light">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="navbar-nav">
                    <RouterLink to="/" class="nav-link">Home</RouterLink>
                    <RouterLink to="/char" class="nav-link">Character Search</RouterLink>
                    <RouterLink to="/team" class="nav-link">Team Builder</RouterLink>
                </div>
            </div>
            <RouterLink to="/settings" class="nav-link navbar-setting"><font-awesome-icon icon="gear"></font-awesome-icon></RouterLink>
        </nav>
    </header>

    <div class="main-content container-xxl">
        <RouterView></RouterView>
    </div>

    <footer class="footer">
        <div class="container-xxl bg-light">
            HashRef : {{commithash}}
        </div>
    </footer>

</template>

<style>
@import './assets/style.css';

.navbar .navbar-setting
{
    color: rgba(0, 0 ,0 ,0.55);
    float: right;
}
</style>
