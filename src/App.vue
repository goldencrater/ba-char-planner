<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <header class="container-xxl">
        <nav class="navbar navbar-expand-xxl navbar-light bg-light">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="navbar-nav">
                    <RouterLink to="/" class="nav-link">Home</RouterLink>
                    <RouterLink to="/char" class="nav-link">Character List</RouterLink>
                    <RouterLink to="/team" class="nav-link">Team Builder</RouterLink>
                </div>
            </div>
        </nav>
    </header>

    <div class="container-xxl">
        <RouterView></RouterView>
    </div>

</template>

<style>
@import './assets/style.css';
</style>
