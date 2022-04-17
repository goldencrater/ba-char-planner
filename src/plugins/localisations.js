import localisationStrings from '../assets/computed/localisations.json';
import manualLocalisationStrings from '../assets/manualLocalisation.json';
import { useSettingsStorage } from '../stores/SettingsStorage.js';

let language = 'En';

export default {
    install: (app) => {
        const settings = useSettingsStorage();
        language = settings.settings.Language;
        app.config.globalProperties.$tC = translateCharacter
    },
}

export const tc = translateCharacter;


const colorRegex = /\[c\]\[([a-f0-9]{6})\]([^[]+)\[-\]\[\/c\]/g

export function translateCharacter(charId, path, skillRegex = false)
{
    let fullPath = charId + '.' + language + '.' + path;
    let returnString = deepGetObject(localisationStrings.Characters, fullPath);
    if(!returnString)
    {
        returnString = deepGetObject(manualLocalisationStrings.Characters, fullPath);
    }
    if(!returnString)
    {
        returnString = deepGetObject(localisationStrings.Characters[charId]['Jp'], path);
    }
    if(!returnString)
    {
        returnString = '$Characters.' + fullPath;
    }
    if(skillRegex)
    {
        returnString = returnString.replace(colorRegex, '<span style="color: #$1;">$2</span>')
    }
    return returnString;
}

function deepGetObject(obj, path)
{
    const pathbits = path.split('.');
    while(pathbits.length > 1)
    {
        let bit = pathbits.shift();
        if(typeof(obj[bit]) === 'undefined')
        {
            return;
        }
        obj = obj[bit];
    }
    if(!obj)
    {
        return;
    }
    return obj[pathbits[0]];
}
