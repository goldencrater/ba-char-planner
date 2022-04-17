import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useCharacterStorage = defineStore({
    id: 'characterStorage',
    state: () => {
        return {
            characters: ref(useLocalStorage('characters', {}))
        }
    },
    getters: {
        getCharacter: (store) => {
            return (character) => {
                if(typeof(store.characters[character.Id]) === 'undefined')
                {
                    store.addCharacter(character);
                }
                if(typeof(store.characters[character.Id].WeaponLevel) === 'undefined')
                {
                    store.characters[character.Id].WeaponLevel = 0;
                }
                return store.characters[character.Id];
            }
        },
    },
    actions: {
        addCharacter(character) {
            return this.characters[character.Id] = {
                Id: character.Id,
                Owned: true,
                Stars: character.BaseStar,
                Bond: 1,
                Level: 1,
                WeaponLevel: 0,
                SkillEx: 1,
                Skill1: 1,
                Skill2: 1,
                Skill3: 1,
                Equip1: 0,
                Equip2: 0,
                Equip3: 0
            }
        }
    }
})
