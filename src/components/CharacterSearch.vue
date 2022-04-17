<script setup>
import { translateCharacter } from '../plugins/localisations.js';

import { getCharacterList } from '../composables/Character.js';
import { useSettingsStorage } from '../stores/SettingsStorage.js';

const props = defineProps(['settings']);
const emit = defineEmits(['updateList']);
const tC = translateCharacter;

const searchList = Object.values(getCharacterList());
let filteredList = searchList;

const settingsStorage = useSettingsStorage();
const language = settingsStorage.settings.Language.toLowerCase();

const updateSearchResults = function(value)
{
    let search = value.srcElement.value.toLowerCase();
    if(search.length === 0)
    {
        if(props.settings && props.settings.emptyReturn)
        {
            filteredList = [];
        }
        else
        {
            filteredList = searchList;
        }
    }
    else
    {
        filteredList = searchList.filter((element) => {
            return (tC(element.Id, 'Name').toLowerCase().indexOf(search) >= 0);
        });
    }
    filteredList.sort((a, b) => {
        const aName = tC(a.Id, 'Name').toLowerCase();
        const bName = tC(b.Id, 'Name').toLowerCase();
        let aStartsWithSearch = (aName.indexOf(search) === 0);
        let bStartsWithSearch = (bName.toLowerCase().indexOf(search) === 0);
        if (aStartsWithSearch && bStartsWithSearch)
        {
            return aName.localeCompare(b.Name, language);
        }
        else if(aStartsWithSearch)
        {
            return -1;
        }
        else if (bStartsWithSearch)
        {
            return 1;
        }
        else
        {
            return aName.localeCompare(b.Name, language);
        }
    });
    emit('updateList', filteredList);
}

if(props.settings && props.settings.emptyReturn)
{
    filteredList = [];
}
emit('updateList', filteredList);

</script>

<template>
    <input @input="updateSearchResults">
</template>
