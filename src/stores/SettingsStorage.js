import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useSettingsStorage = defineStore({
    id: 'settingsstorage',
    state: () => {
        return {
            settings: ref(useLocalStorage('settings', {Language: 'En'}))
        }
    },
})
