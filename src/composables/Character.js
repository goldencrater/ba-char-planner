import origCharList from '../assets/computed/charlist.json';
import { useSettingsStorage } from '../stores/SettingsStorage.js';
import { translateCharacter } from '../plugins/localisations.js';


const settings = useSettingsStorage();
const includeJpOnly = settings.settings.IncludeJpOnly;

const charlist = {};

const charentries = Object.values(origCharList);
const charMap = {};
charentries.forEach((element) => {
    if(!includeJpOnly && element.JpOnly)
    {
        return;
    }
    element.Name = translateCharacter(element.Id, 'Name');
    charMap[element.Name.toLowerCase()] = element;
    charlist[element.Id] = element;
})

export function getCharacterById(characterId, filtered = true)
{
    if(filtered)
    {
        return charlist[characterId];
    }
    else
    {
        return origCharList[characterId];
    }
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
    let stars = charStats.Stars;
    let ueStars = 0;
    if(stars >= 5)
    {
        ueStars = (stars - 4).toString(36);
        stars = 5;
    }

    let bond = charStats.Bond.toString(36);
    if(bond.length === 1)
    {
        bond = '0' + bond;
    }
    let level = charStats.Level.toString(36);
    if(level.length === 1)
    {
        level = '0' + level;
    }
    if(typeof(charStats.WeaponLevel) === 'undefined')
    {
        charStats.WeaponLevel = 0;
    }
    let weaponLevel = charStats.WeaponLevel.toString(36);
    if(weaponLevel.length === 1)
    {
        weaponLevel = '0' + weaponLevel;
    }

    let skills = charStats.Skill1.toString(36) + charStats.Skill2.toString(36) + charStats.Skill3.toString(36);
    return charStats.Id + '|' + stars + ueStars + bond + level + weaponLevel +
        charStats.SkillEx.toString(36) + skills + charStats.Equip1.toString(36) + charStats.Equip2.toString(36) + charStats.Equip3.toString(36);
}

export function unhashCharStats(hashString)
{
    const stats = {};
    const split = hashString.split("|");
    stats.Id = parseInt(split[0]);
    stats.Stars = parseInt(split[1][0], 36);
    let ueStars = Math.max(parseInt(split[1][1], 36) - 1, 0);
    stats.Stars += ueStars;
    stats.Bond = parseInt(split[1][2] + split[1][3], 36);
    stats.Level = parseInt(split[1][4] + split[1][5], 36);
    stats.WeaponLevel = parseInt(split[1][6] + split[1][7], 36);
    stats.SkillEx = parseInt(split[1][8], 36);
    stats.Skill1 = parseInt(split[1][9], 36);
    stats.Skill2 = parseInt(split[1][10], 36);
    stats.Skill3 = parseInt(split[1][11], 36);
    stats.Equip1 = parseInt(split[1][12], 36);
    stats.Equip2 = parseInt(split[1][13], 36);
    stats.Equip3 = parseInt(split[1][14], 36);
    return stats;
}
