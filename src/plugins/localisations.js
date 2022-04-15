import localisationStrings from '../assets/computed/localisations.json';
import { useSettingsStorage } from '../stores/SettingsStorage.js';

let language = 'En';

export default {
    install: (app, options) => {
        const settings = useSettingsStorage();
        language = settings.settings.Language;
        app.config.globalProperties.$tC = translateCharacter

        app.provide('translateCharacter', translateCharacter);
    }
}

const colorRegex = /\[c\]\[([a-f0-9]{6})\]([^[]+)\[-\]\[\/c\]/g

function translateCharacter(charId, path, skillRegex = false)
{
    let returnString = deepGetObject(localisationStrings.Characters[charId][language], path);
    if(returnString == undefined)
    {
        returnString = '$Characters.' + charId + '.' + settings.settings.Language + '.' + path;
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
            return null;
        }
        obj = obj[bit];
    }
    return obj[pathbits[0]];
}
