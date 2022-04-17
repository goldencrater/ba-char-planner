import charlist from '../assets/computed/charlist.json';
import { useSettingsStorage } from '../stores/SettingsStorage.js';
import { translateCharacter } from '../plugins/localisations.js';


const settings = useSettingsStorage();
const includeJpOnly = settings.settings.IncludeJpOnly;

const charentries = Object.values(charlist);
const charMap = {};
charentries.forEach((element) => {
    if(!includeJpOnly && element.JpOnly)
    {
        delete charlist[element.Id];
        return;
    }
    element.Name = translateCharacter(element.Id, 'Name');
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

export function hashCharStats(charStats)
{
    let bond = charStats.Bond.toString();
    if(bond.length === 1)
    {
        bond = '0' + bond;
    }
    let level = charStats.Level.toString();
    if(level.length === 1)
    {
        level = '0' + level;
    }
    let skills = (charStats.Skill1 - 1).toString() + (charStats.Skill2 - 1).toString() + (charStats.Skill3 - 1).toString();
    return charStats.Id + '|' + charStats.Stars + bond + level + charStats.SkillEx + skills + charStats.Equip1 + charStats.Equip2 + charStats.Equip3;
}

export function unhashCharStats(hashString)
{
    const stats = {};
    const split = hashString.split("|");
    stats.Id = parseInt(split[0]);
    stats.Stars = parseInt(split[1][0]);
    stats.Bond = parseInt(split[1][1] + split[1][2]);
    stats.Level = parseInt(split[1][3] + split[1][4]);
    stats.SkillEx = parseInt(split[1][5]);
    stats.Skill1 = parseInt(split[1][6]) + 1;
    stats.Skill2 = parseInt(split[1][7]) + 1;
    stats.Skill3 = parseInt(split[1][8]) + 1;
    stats.Equip1 = parseInt(split[1][9]);
    stats.Equip2 = parseInt(split[1][10]);
    stats.Equip3 = parseInt(split[1][11]);
    return stats;
}
