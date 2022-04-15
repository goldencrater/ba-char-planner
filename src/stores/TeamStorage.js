import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useTeamStorage = defineStore({
    id: 'teamstorage',
    state: () => {
        return {
            team: ref(useLocalStorage('team', {}))
        }
    },
})
