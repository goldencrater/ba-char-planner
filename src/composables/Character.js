import charlist from '../assets/computed/charlist.json';

const charentries = Object.values(charlist);
const charMap = {};
charentries.forEach((element) => {
    charMap[element.Name.toLowerCase()] = element;
})

export function getCharacterById(characterId)
{
    return charlist[characterId];
}

export function getCharacterByName(name)
{
    return charMap[name.toLowerCase()];
}

export function getCharacterList()
{
    return charlist;
}

export function getCharacterListByName()
{
    return charMap;
}
