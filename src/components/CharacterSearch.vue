<script setup>
import { getCharacterList } from '../composables/Character.js';
import { computed } from 'vue';

const props = defineProps(['settings']);
const emit = defineEmits(['updateList']);

const searchList = Object.values(getCharacterList());
let filteredList = searchList;

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
            return (element.Name.toLowerCase().indexOf(search) >= 0);
        });
    }
    filteredList.sort((a, b) => {
        let aStartsWithSearch = (a.Name.toLowerCase().indexOf(search) === 0);
        let bStartsWithSearch = (b.Name.toLowerCase().indexOf(search) === 0);
        if (aStartsWithSearch && bStartsWithSearch)
        {
            return (a.Name.toLowerCase() > b.Name.toLowerCase()) ? 1 : -1;
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
            return (a.Name.toLowerCase() > b.Name.toLowerCase()) ? 1 : -1;
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
