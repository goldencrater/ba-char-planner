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
    let fullPath = 'Characters.' + charId + '.' + path;
    let returnString = deepGetObject(localisationStrings[language], fullPath);
    if(!returnString)
    {
        returnString = deepGetObject(manualLocalisationStrings[language], fullPath);
    }
    if(!returnString)
    {
        returnString = deepGetObject(localisationStrings.Jp, fullPath);
    }
    if(!returnString)
    {
        returnString = fullPath;
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
