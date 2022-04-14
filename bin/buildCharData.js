/*
 * Parse the raw game JSON into a format we can use for this project
 *
 * Requires the following files:
 * - CharacterExcelTable.json The raw character data
 * - LocalizeEtcExcelTable.json The translation strings for CharacterExcelTable
 * - CharacterSkillListExcelTable.json The raw character skills data
 * - SkillExcelTable.json The raw skill stats
 * - CharacterStatExcelTable.json The character's stat data (inc affinities)
 * - LocalizeSkillExcelTable.json The translation strings for SkillExcelTable
 * - RecipeExcelTable.json The items group required for each skill upgrade
 * - RecipeIngredientExcelTable.json The items from each group for each skill upgrade
 * - ItemExcelTable.json The table of items for each skill upgrade
 * -
 */

const util = require('util');
const fs = require('fs');

// Utility functions
function deepPutObject(obj, path, value)
{
    const pathbits = path.split('.');
    while(pathbits.length > 1)
    {
        let bit = pathbits.shift();
        if(typeof(obj[bit]) === 'undefined')
        {
            obj[bit] = {};
        }
        obj = obj[bit];
    }
    obj[pathbits[0]] = value;
}

function parseLocalisationStrings(localisationData, path, localisationStrings, stringType)
{
    const languages = ['En', 'Jp', 'Kr', 'Tw', 'Th'];
    languages.forEach((lang) => {
        deepPutObject(localisationData, lang + '.' + path, localisationStrings[stringType + lang]);
    });
}

function extractSkillData(logicGroupIds, internalSkillData, location)
{
    internalSkillData.EntityTimeline.forEach((element) => {
        element.Entity?.Abilities?.forEach((ability) => {
            ability?.LogicEffectGroupIds?.forEach((groupId) => {
                if(typeof(logicGroupIds[groupId]) === 'undefined')
                {
                    logicGroupIds[groupId] = location;
                }
                else if (logicGroupIds[groupId] !== location)
                {
                    throw 'Dupe skill ' + groupId;
                }
            })
        })
        element.Entity?.AreaAbilities?.forEach((ability) => {
            ability?.LogicEffectGroupIds?.forEach((groupId) => {
                if(typeof(logicGroupIds[groupId]) === 'undefined')
                {
                    logicGroupIds[groupId] = location;
                }
                else if (logicGroupIds[groupId] !== location)
                {
                    throw 'Dupe skill ' + groupId;
                }
            })
        })
        element.Entity?.InitialAbilities?.forEach((ability) => {
            ability?.LogicEffectGroupIds?.forEach((groupId) => {
                if(typeof(logicGroupIds[groupId]) === 'undefined')
                {
                    logicGroupIds[groupId] = location;
                }
                else if (logicGroupIds[groupId] !== location)
                {
                    throw 'Dupe skill ' + groupId;
                }
            })
        })
        element.Entity?.SplashAreaEntityData?.Abilities?.forEach((ability) => {
            ability?.LogicEffectGroupIds?.forEach((groupId) => {
                if(typeof(logicGroupIds[groupId]) === 'undefined')
                {
                    logicGroupIds[groupId] = location;
                }
                else if (logicGroupIds[groupId] !== location)
                {
                    throw 'Dupe skill ' + groupId;
                }
            })
        })
        element.Entity?.SplashAreaEntityData?.AreaAbilities?.forEach((ability) => {
            ability?.LogicEffectGroupIds?.forEach((groupId) => {
                if(typeof(logicGroupIds[groupId]) === 'undefined')
                {
                    logicGroupIds[groupId] = location;
                }
                else if (logicGroupIds[groupId] !== location)
                {
                    throw 'Dupe skill ' + groupId;
                }
            })
        })
        element.Entity?.SplashAreaEntityData?.InitialAbilities?.forEach((ability) => {
            ability?.LogicEffectGroupIds?.forEach((groupId) => {
                if(typeof(logicGroupIds[groupId]) === 'undefined')
                {
                    logicGroupIds[groupId] = location;
                }
                else if (logicGroupIds[groupId] !== location)
                {
                    throw 'Dupe skill ' + groupId;
                }
            })
        })
    })
}

// For localisation output
const localisationOutput = {
    Characters: {},
    Items: {}
};

const images = {};

// Process the localizeEtcExcelTable file
const localizeEtcJson = fs.readFileSync('../orig/data/Excel/LocalizeEtcExcelTable.json');
const localizeEtc = JSON.parse(localizeEtcJson);
const localizeEtcMap = {};
localizeEtc.DataList.forEach((element) => {
    localizeEtcMap[element.Key] = element;
})

// Process the CharacterSkillListExcelTable
const characterSkillListJson = fs.readFileSync('../orig/data/Excel/CharacterSkillListExcelTable.json');
const characterSkillList = JSON.parse(characterSkillListJson);
const characterSkillListMap = {};
characterSkillList.DataList.forEach((element) => {
    if(typeof(characterSkillListMap[element.CharacterId]) !== 'undefined')
    {
        // Duplicate, usually due to a form
        console.log('Duplicate Character Skill for ' + element.CharacterId);
        return;
    }
    characterSkillListMap[element.CharacterId] = element;
})

// Process the SkillExcelTable
const skillExcelTableJson = fs.readFileSync('../orig/data/Excel/SkillExcelTable.json');
const skillExcelTable = JSON.parse(skillExcelTableJson);
const skillExcelTableMap = {};
skillExcelTable.DataList.forEach((element) => {
    if(typeof(skillExcelTableMap[element.GroupId]) === 'undefined')
    {
        skillExcelTableMap[element.GroupId] = {};
    }
    skillExcelTableMap[element.GroupId][element.Level] = element;
})

// Process the CharacterStatExcelTable
const characterStatExcelJson = fs.readFileSync('../orig/data/Excel/CharacterStatExcelTable.json');
const characterStatExcel = JSON.parse(characterStatExcelJson);
const characterStatExcelMap = {};
characterStatExcel.DataList.forEach((element) => {
    characterStatExcel[element.CharacterId] = element;
})

// Process the localizeEtcExcelTable file
const localizeSkillJson = fs.readFileSync('../orig/data/Excel/LocalizeSkillExcelTable.json');
const localizeSkill = JSON.parse(localizeSkillJson);
const localizeSkillMap = {};
localizeSkill.DataList.forEach((element) => {
    localizeSkillMap[element.Key] = element;
})

// Process the ItemExcelTable file
const itemExcelTableJson = fs.readFileSync('../orig/data/Excel/ItemExcelTable.json');
const itemExcelTable = JSON.parse(itemExcelTableJson);
const itemMap = {};
itemExcelTable.DataList.forEach((element) => {
    if(element.ProductionStep === 'Complete')
    {
        // Unreleased item, skip
        return;
    }
    const item = {
        Id: element.Id,
        Name: localizeEtcMap[element.LocalizeEtcId].NameEn,
        Description: localizeEtcMap[element.LocalizeEtcId].DescriptionEn,
        Rarity: element.Rarity,
        Icon: element.Icon.substr(30),
    }
    itemMap[element.Id] = item;

    images[element.Icon] = "Items/" + item.Icon;

    parseLocalisationStrings(localisationOutput.Items, element.Id + '.Name', localizeEtcMap[element.LocalizeEtcId], 'Name');
    parseLocalisationStrings(localisationOutput.Items, element.Id + '.Description', localizeEtcMap[element.LocalizeEtcId], 'Description');
});

// Process the RecipeIngredientExcelTable file
const recipeIngredientJson = fs.readFileSync('../orig/data/Excel/RecipeIngredientExcelTable.json');
const recipeIngredient = JSON.parse(recipeIngredientJson);
const recipeIngredientMap = {};
recipeIngredient.DataList.forEach((element) => {
    const recipe = {
        Id: element.Id,
        Currency: element.CostAmount[0],
        Items: [],
    };
    if(element.CostAmount.length > 1)
    {
        console.log(util.inspect(element, false, null, true));
        throw '';
    }
    for(let i = 0; i < element.IngredientId.length; i++)
    {
        recipe.Items.push({
            ItemId: element.IngredientId[i],
            ItemName: itemMap[element.IngredientId[i]]?.Name,
            Quantity: element.IngredientAmount[i],
        })
    }
    recipeIngredientMap[element.Id] = recipe;
})

// Process the RecipeExcelTable file
const recipeListJson = fs.readFileSync('../orig/data/Excel/RecipeExcelTable.json');
const recipeList = JSON.parse(recipeListJson);
const recipeListMap = {};
recipeList.DataList.forEach((element) => {
    recipeListMap[element.Id] = element;
})

// Process the newskilldata file
const newskilldataJson = fs.readFileSync('../orig/data/Battle/newskilldata.json');
const newskilldata = JSON.parse(newskilldataJson);
const newskilldataMap = {};
newskilldata.forEach((element) => {
    if(typeof(newskilldataMap[element.GroupName]) === 'undefined')
    {
        newskilldataMap[element.GroupName] = [];
    }
    newskilldataMap[element.GroupName].push(element);
})

// Process the logiceffectdata file
const logiceffectdataJson = fs.readFileSync('../orig/data/Battle/logiceffectdata.json');
const logiceffectdata = JSON.parse(logiceffectdataJson);
const logiceffectdataMap = {};
logiceffectdata.forEach((element) => {
    if(typeof(logiceffectdataMap[element.GroupId]) === 'undefined')
    {
        logiceffectdataMap[element.GroupId] = [];
    }
    logiceffectdataMap[element.GroupId].push(element);
})

// Process the CharacterExcelTable
const mainCharDataJson = fs.readFileSync('../orig/data/Excel/CharacterExcelTable.json');
const mainCharData = JSON.parse(mainCharDataJson);

const playableChars = {};

const slots = {};

mainCharData.DataList.forEach((element) => {
    if(!element.IsPlayableCharacter)
    {
        // NPC
        return;
    }
    if(element.ProductionStep !== 'Release')
    {
        // Not yet in the game, so some data is missing. Skip for now.
        return;
    }

    const localisationData = {};

    // Basic Character Data
    const thisChar = {
        Id: element.Id,
        DevName: element.DevName,
        Name: localizeEtcMap[element.LocalizeEtcId].NameEn,
        BaseStar: element.DefaultStarGrade,
        Icon: element.CollectionTexturePath.substr(34),
        Rarity: element.Rarity,
        Type: (element.SquadType === 'Main' ? 'Striker' : 'Special'),
        School: element.School,
        DamageType: null,
        DefenseType: null,
        Affinities: {
            Urban: characterStatExcel[element.Id].StreetBattleAdaptation,
            Outdoors: characterStatExcel[element.Id].OutdoorBattleAdaptation,
            Indoors: characterStatExcel[element.Id].IndoorBattleAdaptation,
        },
        Equipment: {
            Slot1: element.EquipmentSlot[0],
            Slot2: element.EquipmentSlot[1],
            Slot3: element.EquipmentSlot[2]
        },
        Skills: {
            Ex: null,
            Skill1: null,
            Skill2: null,
            Skill3: null,
        },
    };

    switch(element.BulletType)
    {
        case 'Explosion':
        {
            thisChar.DamageType = 'Explosive';
            break;
        }
        case 'Pierce':
        {
            thisChar.DamageType = 'Piercing';
            break;
        }
        case 'Mystic':
        {
            thisChar.DamageType = 'Mystic';
            break;
        }
        default:
        {
            console.log('Unknown bullet type for ' . element.Id);
            thisChar.DamageType = 'Unknown';
        }
    }

    switch(element.ArmorType)
    {
        case 'LightArmor':
        {
            thisChar.DefenseType = 'Light';
            break;
        }
        case 'HeavyArmor':
        {
            thisChar.DefenseType = 'Heavy';
            break;
        }
        case 'Unarmed':
        {
            thisChar.DefenseType = 'Special';
            break;
        }
        default:
        {
            console.log('Unknown defense type for ' . element.Id);
            thisChar.DefenseType = 'Unknown';
        }
    }

    images[element.CollectionTexturePath] = "Character/" + thisChar.Icon;

    parseLocalisationStrings(localisationData, 'Name', localizeEtcMap[element.LocalizeEtcId], 'Name');

    // Character Skills Raw Data
    const charSkills = characterSkillListMap[element.Id];
    if(!charSkills)
    {
        console.log(thisChar);
        throw 'Char skill lookup failed';
    }
    const exSkillData = skillExcelTableMap[charSkills.ExSkillGroupId[0]];
    const skillData = {
        1: skillExcelTableMap[charSkills.PublicSkillGroupId[0]],
        2: skillExcelTableMap[charSkills.PassiveSkillGroupId[0]],
        3: skillExcelTableMap[charSkills.ExtraPassiveSkillGroupId[0]]
    }

    const logicGroupIds = {};

    if(typeof(newskilldataMap[charSkills.ExSkillGroupId[0]]) !== 'undefined')
    {
        const internalSkillData = newskilldataMap[charSkills.ExSkillGroupId[0]][0];
        extractSkillData(logicGroupIds, internalSkillData, thisChar.Name + 'Ex');
    }

    if(typeof(newskilldataMap[charSkills.PublicSkillGroupId[0]]) !== 'undefined')
    {
        const internalSkillData = newskilldataMap[charSkills.PublicSkillGroupId[0]][0];
        extractSkillData(logicGroupIds, internalSkillData, thisChar.Name + 'Normal');

    }

    if(typeof(newskilldataMap[charSkills.PassiveSkillGroupId[0]]) !== 'undefined')
    {
        const internalSkillData = newskilldataMap[charSkills.PassiveSkillGroupId[0]][0];
        extractSkillData(logicGroupIds, internalSkillData, thisChar.Name + 'Passive');

    }

    if(typeof(newskilldataMap[charSkills.ExtraPassiveSkillGroupId[0]]) !== 'undefined')
    {
        const internalSkillData = newskilldataMap[charSkills.ExtraPassiveSkillGroupId[0]][0];
        extractSkillData(logicGroupIds, internalSkillData, thisChar.Name + 'Ex');
    }

    Object.keys(logicGroupIds).forEach((logicGroupId) => {
        if(typeof(logiceffectdataMap[logicGroupId]) === 'undefined')
        {
            console.log(logicGroupIds);
            throw 'Unknown logic groupId ' + logicGroupId;
        }
        const category = logiceffectdataMap[logicGroupId][0].EffectData.Category;
        const channel = logiceffectdataMap[logicGroupId][0].EffectData.Channel;
        if(typeof(slots[category]) === 'undefined')
        {
            slots[category] = {};
        }
        if(typeof(slots[category][channel]) === 'undefined')
        {
            slots[category][channel] = [];
        }
        slots[category][channel].push(logicGroupIds[logicGroupId]);
    })

    thisChar.Skills.Ex = {
        Name: localizeSkillMap[exSkillData[1].LocalizeSkillId].NameEn,
    };

    parseLocalisationStrings(localisationData, 'Skills.Ex.Name', localizeSkillMap[exSkillData[1].LocalizeSkillId], 'Name');

    for(let i = 1; i <= 5; i++)
    {
        let level = 'Level' + i;
        thisChar.Skills.Ex[level] = {
            Description: localizeSkillMap[exSkillData[i].LocalizeSkillId].DescriptionEn,
            Cost: exSkillData[i].SkillCost,
            LevelUpMats: recipeIngredientMap[recipeListMap[exSkillData[i].RequireLevelUpMaterial].RecipeIngredientId],
            Icon: exSkillData[i].IconName.substr(28),
        }
        parseLocalisationStrings(localisationData, 'Skills.Ex.' + level + '.Description', localizeSkillMap[exSkillData[i].LocalizeSkillId], 'Description');
        images[exSkillData[i].IconName] = "Skills/" + thisChar.Skills.Ex[level].Icon;
    }

    for(let i = 1; i <= 3; i++)
    {
        let thisSkillData = skillData[i];
        if(!thisSkillData)
        {
            console.log(thisChar);
            console.log(charSkills);
            console.log(skillData);
            throw 'No skill data found';
        }
        let skillString = 'Skill' + i;
        thisChar.Skills[skillString] = {
            Name: localizeSkillMap[thisSkillData[1].LocalizeSkillId].NameEn
        }
        parseLocalisationStrings(localisationData, 'Skills.' + skillString + '.Name', localizeSkillMap[thisSkillData[1].LocalizeSkillId], 'Name');
        for(let j = 1; j <= 10; j++)
        {
            let level = 'Level' + j;
            thisChar.Skills[skillString][level] = {
                Description: localizeSkillMap[thisSkillData[j].LocalizeSkillId].DescriptionEn,
                LevelUpMats: recipeIngredientMap[recipeListMap[thisSkillData[j].RequireLevelUpMaterial].RecipeIngredientId],
                Icon: thisSkillData[j].IconName.substr(28),
            };
            parseLocalisationStrings(localisationData, 'Skills.' + skillString + '.' + level + '.Description', localizeSkillMap[thisSkillData[j].LocalizeSkillId], 'Description');
            images[thisSkillData[j].IconName] = "Skills/" + thisChar.Skills[skillString][level].Icon;
        }
    }

    playableChars[element.Id] = thisChar;
    localisationOutput.Characters[element.Id] = localisationData;
});

fs.mkdirSync('../public/import/Character', {recursive: true});
fs.mkdirSync('../public/import/Skills', {recursive: true});
fs.mkdirSync('../public/import/Icons', {recursive: true});
fs.mkdirSync('../public/import/Items', {recursive: true});
fs.mkdirSync('../public/import/Equipment', {recursive: true});

images['UIs/01_Common/03_NonEquipment/Currency_Icon_Gold'] = 'Items/Currency_Icon_Gold';

images['UIs/01_Common/11_SchoolIcon/School_Icon_ABYDOS'] = 'Icons/Abydos';
images['UIs/01_Common/11_SchoolIcon/School_Icon_GEHENNA'] = 'Icons/Gehenna';
images['UIs/01_Common/11_SchoolIcon/School_Icon_HYAKKIYAKO'] = 'Icons/Hyakkiyako';
images['UIs/01_Common/11_SchoolIcon/School_Icon_MILLENNIUM'] = 'Icons/Millennium';
images['UIs/01_Common/11_SchoolIcon/School_Icon_REDWINTER'] = 'Icons/RedWinter';
images['UIs/01_Common/11_SchoolIcon/School_Icon_SHANHAIJING'] = 'Icons/Shanhaijing';
images['UIs/01_Common/11_SchoolIcon/School_Icon_TRINITY'] = 'Icons/Trinity';
images['UIs/01_Common/11_SchoolIcon/School_Icon_VALKYRIE'] = 'Icons/Valkyrie';

for(const [from, to] of Object.entries(images))
{
    try
    {
        fs.copyFileSync('../orig/' + from + '.png', '../public/import/' + to + '.png');
    }
    catch (e)
    {
        if(e.code === 'ENOENT')
        {
            console.log('Could not find ' + from);
            fs.copyFileSync('../orig/UIs/01_Common/03_NonEquipment/Material_Icon_Error.png', '../public/import/' + to + '.png');
        }
    }
}

fs.writeFileSync('../src/assets/computed/charlist.json', JSON.stringify(playableChars, null, '\t'));
fs.writeFileSync('../src/assets/computed/itemlist.json', JSON.stringify(itemMap, null, '\t'));
fs.writeFileSync('../src/assets/computed/localisations.json', JSON.stringify(localisationOutput, null, '\t'));
