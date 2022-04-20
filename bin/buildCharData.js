/*
 * Parse the raw game JSON into a format we can use for this project
 *
 * Requires the following files:
 * - CharacterExcelTable.json The raw character data
 * - LocalizeEtcExcelTable.json The translation strings for CharacterExcelTable
 * - CharacterWeaponExcelTable.json The details about the Character Weapons
 * - LocalizeCharProfileExcelTable.json Misc Character Profile data
 * - CharacterSkillListExcelTable.json The raw character skills data
 * - SkillExcelTable.json The raw skill stats
 * - CharacterStatExcelTable.json The character's stat data (inc affinities)
 * - LocalizeSkillExcelTable.json The translation strings for SkillExcelTable
 * - RecipeExcelTable.json The items group required for each skill upgrade
 * - RecipeIngredientExcelTable.json The items from each group for each skill upgrade
 * - ItemExcelTable.json The table of items for each skill upgrade
 * -
 */

const includeJp = true;

const util = require('util');
const fs = require('fs');

// Utility functions
function deepPutObject(obj, path, value, overwrite = true)
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
    if(overwrite || typeof(obj[pathbits[0]]) === 'undefined')
    {
        obj[pathbits[0]] = value;
    }
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

function parseLocalisationStrings(type, uniqueId, path, localisationStrings, stringType)
{
    const languages = ['En', 'Jp', 'Kr', 'Tw', 'Th'];
    languages.forEach((lang) => {
        deepPutObject(localisationOutput, lang + '.' + type + '.' + uniqueId, {}, false);
        deepPutObject(missingLocalisationOutput, lang + '.' + type + '.' + uniqueId, {}, false);
        deepPutObject(manualLocalisationOutput, lang + '.' + type + '.' + uniqueId, {}, false);

        const localisationData = localisationOutput[lang][type][uniqueId];
        const missingLocalisation = missingLocalisationOutput[lang][type][uniqueId];
        const manualLocalisation = manualLocalisationOutput[lang][type][uniqueId];

        deepPutObject(localisationData, path, localisationStrings[stringType + lang], false);
        if(!localisationStrings[stringType + lang])
        {
            if(!deepGetObject(manualLocalisation, path))
            {
                deepPutObject(missingLocalisation, path, '');
            }
        }
        else
        {
            if(deepGetObject(manualLocalisation, path))
            {
                delete manualLocalisationOutput[lang][type][uniqueId];
            }
        }

        if(Object.keys(missingLocalisationOutput[lang][type][uniqueId]).length === 0)
        {
            delete missingLocalisationOutput[lang][type][uniqueId];
        }
        if(Object.keys(manualLocalisationOutput[lang][type][uniqueId]).length === 0)
        {
            delete manualLocalisationOutput[lang][type][uniqueId];
        }
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
const localisationOutput = {};

const missingLocalisationOutput = {};
const manualLocalisationJson = fs.readFileSync('../src/assets/manualLocalisation.json');
const manualLocalisationOutput = JSON.parse(manualLocalisationJson);

const images = {};

// Process the localizeEtcExcelTable file
const localizeEtcJson = fs.readFileSync('../orig/data/Excel/LocalizeEtcExcelTable.json');
const localizeEtc = JSON.parse(localizeEtcJson);
const localizeEtcMap = {};
localizeEtc.DataList.forEach((element) => {
    localizeEtcMap[element.Key] = element;
})

if(includeJp)
{
    const jpLocalizeEtcJson = fs.readFileSync('../orig/jp-data/Excel/LocalizeEtcExcelTable.json');
    const jpLocalizeEtc = JSON.parse(jpLocalizeEtcJson);
    jpLocalizeEtc.DataList.forEach((element) => {
        if(typeof(localizeEtcMap[element.Key]) !== 'undefined')
        {
            return;
        }
        localizeEtcMap[element.Key] = element;
    })
}


// Process the localizeSkillEtcExcelTable file
const localizeSkillJson = fs.readFileSync('../orig/data/Excel/LocalizeSkillExcelTable.json');
const localizeSkill = JSON.parse(localizeSkillJson);
const localizeSkillMap = {};
localizeSkill.DataList.forEach((element) => {
    localizeSkillMap[element.Key] = element;
})

if(includeJp)
{
    const jpLocalizeSkillJson = fs.readFileSync('../orig/jp-data/Excel/LocalizeSkillExcelTable.json');
    const jpLocalizeSkill = JSON.parse(jpLocalizeSkillJson);
    jpLocalizeSkill.DataList.forEach((element) => {
        if(typeof(localizeSkillMap[element.Key]) !== 'undefined')
        {
            return;
        }
        localizeSkillMap[element.Key] = element;
    });
}


// Process the CharacterSkillListExcelTable
function processCharacterSkillListElement(element)
{
    if(typeof(characterSkillListMap[element.CharacterId]) !== 'undefined')
    {
        // Duplicate, detect whether it's a UE or form change
        if(element.IsFormConversion)
        {
            // Form change, we just skip these since we don't really care much about them for now
            return;
        }
        if(element.MinimumGradeCharacterWeapon > 0)
        {
            if(typeof(characterSkillListMap[element.CharacterId].CharacterWeapon) === 'undefined')
            {
                characterSkillListMap[element.CharacterId].CharacterWeapon = {};
            }
            // UE changes
            switch(element.MinimumGradeCharacterWeapon)
            {
                case 2:
                {
                    // New Passive
                    characterSkillListMap[element.CharacterId].CharacterWeapon[2] = element;
                    break;
                }
                default:
                {
                    console.log('Unknown MinimumGradeCharacterWeapon ' + element.MinimumGradeCharacterWeapon + ' for ' + element.CharacterId);
                }
            }
            return;
        }
        return;
    }
    characterSkillListMap[element.CharacterId] = element;
}

const characterSkillListJson = fs.readFileSync('../orig/data/Excel/CharacterSkillListExcelTable.json');
const characterSkillList = JSON.parse(characterSkillListJson);
const characterSkillListMap = {};
characterSkillList.DataList.forEach(processCharacterSkillListElement);

if(includeJp)
{
    const jpCharacterSkillListJson = fs.readFileSync('../orig/jp-data/Excel/CharacterSkillListExcelTable.json');
    const jpCharacterSkillList = JSON.parse(jpCharacterSkillListJson);
    jpCharacterSkillList.DataList.forEach(processCharacterSkillListElement);
}

// Process the SkillExcelTable
function processSkillExcelElement(element)
{
    if(typeof(localizeSkillMap[element.LocalizeSkillId]) === 'undefined')
    {
        // Incomplete skill, skip
        return;
    }
    if(typeof(skillExcelTableMap[element.GroupId]) === 'undefined')
    {
        skillExcelTableMap[element.GroupId] = {};
    }
    if(typeof(skillExcelTableMap[element.GroupId][element.Level]) === 'undefined')
    {
        skillExcelTableMap[element.GroupId][element.Level] = element;
    }
}

const skillExcelTableJson = fs.readFileSync('../orig/data/Excel/SkillExcelTable.json');
const skillExcelTable = JSON.parse(skillExcelTableJson);
const skillExcelTableMap = {};
skillExcelTable.DataList.forEach(processSkillExcelElement);

if(includeJp)
{
    const jpSkillExcelTableJson = fs.readFileSync('../orig/jp-data/Excel/SkillExcelTable.json');
    const jpSkillExcelTable = JSON.parse(jpSkillExcelTableJson);
    jpSkillExcelTable.DataList.forEach(processSkillExcelElement);
}

// Process the CharacterStatExcelTable
const characterStatExcelJson = fs.readFileSync('../orig/data/Excel/CharacterStatExcelTable.json');
const characterStatExcel = JSON.parse(characterStatExcelJson);
const characterStatExcelMap = {};
characterStatExcel.DataList.forEach((element) => {
    characterStatExcel[element.CharacterId] = element;
});

if(includeJp)
{
    const jpCharacterStatExcelJson = fs.readFileSync('../orig/jp-data/Excel/CharacterStatExcelTable.json');
    const jpCharacterStatExcel = JSON.parse(jpCharacterStatExcelJson);
    jpCharacterStatExcel.DataList.forEach((element) => {
        if(typeof(characterStatExcel[element.CharacterId]) === 'undefined')
        {
            characterStatExcel[element.CharacterId] = element;
        }
    });
}

// Process the ItemExcelTable file
function processItemExcelElement(element)
{
    if(typeof(itemMap[element.Id]) !== 'undefined')
    {
        return;
    }
    if(element.ProductionStep === 'Complete')
    {
        // Unreleased item, skip
        return;
    }
    const item = {
        Id: element.Id,
        Name: localizeEtcMap[element.LocalizeEtcId].NameEn || localizeEtcMap[element.LocalizeEtcId].NameJp,
        Description: localizeEtcMap[element.LocalizeEtcId].DescriptionEn || localizeEtcMap[element.LocalizeEtcId].DescriptionJp,
        Rarity: element.Rarity,
        Icon: element.Icon?.substr(30),
    }
    itemMap[element.Id] = item;

    if(typeof(localizeEtcMap[element.LocalizeEtcId].NameEn) !== 'undefined')
    {
        images[element.Icon] = "Items/" + item.Icon;
    }
    else
    {
        images['jp-' + element.Icon] = "Items/" + item.Icon;
    }

    parseLocalisationStrings('Items', element.Id, 'Name', localizeEtcMap[element.LocalizeEtcId], 'Name');
    parseLocalisationStrings('Items', element.Id, 'Description', localizeEtcMap[element.LocalizeEtcId], 'Description');
}

const itemExcelTableJson = fs.readFileSync('../orig/data/Excel/ItemExcelTable.json');
const itemExcelTable = JSON.parse(itemExcelTableJson);
const itemMap = {};
itemExcelTable.DataList.forEach(processItemExcelElement);

if(includeJp)
{
    const jpItemExcelTableJson = fs.readFileSync('../orig/jp-data/Excel/ItemExcelTable.json');
    const jpItemExcelTable = JSON.parse(jpItemExcelTableJson);
    jpItemExcelTable.DataList.forEach(processItemExcelElement);
}

// Process the RecipeIngredientExcelTable file
function parseRecipeIngredientElement(element)
{
    if(typeof(recipeIngredientMap[element.Id]) !== 'undefined')
    {
        return;
    }
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
}

const recipeIngredientJson = fs.readFileSync('../orig/data/Excel/RecipeIngredientExcelTable.json');
const recipeIngredient = JSON.parse(recipeIngredientJson);
const recipeIngredientMap = {};
recipeIngredient.DataList.forEach(parseRecipeIngredientElement)

if(includeJp)
{
    const jpRecipeIngredientJson = fs.readFileSync('../orig/jp-data/Excel/RecipeIngredientExcelTable.json');
    const jpRecipeIngredient = JSON.parse(jpRecipeIngredientJson);
    jpRecipeIngredient.DataList.forEach(parseRecipeIngredientElement)
}

// Process the RecipeExcelTable file
const recipeListJson = fs.readFileSync('../orig/data/Excel/RecipeExcelTable.json');
const recipeList = JSON.parse(recipeListJson);
const recipeListMap = {};
recipeList.DataList.forEach((element) => {
    recipeListMap[element.Id] = element;
})

if(includeJp)
{
    const jpRecipeListJson = fs.readFileSync('../orig/jp-data/Excel/RecipeExcelTable.json');
    const jpRecipeList = JSON.parse(jpRecipeListJson);
    jpRecipeList.DataList.forEach((element) => {
        if(typeof(recipeListMap[element.Id]) !== 'undefined')
        {
            return;
        }
        recipeListMap[element.Id] = element;
    })
}

// Process the CharacterWeaponExcelTable
const charWeaponListJson = fs.readFileSync('../orig/data/Excel/CharacterWeaponExcelTable.json');
const charWeaponList = JSON.parse(charWeaponListJson);
const charWeaponListMap = {};
charWeaponList.DataList.forEach((element) => {
    charWeaponListMap[element.Id] = element;
});

if(includeJp)
{
    const jpCharWeaponListJson = fs.readFileSync('../orig/jp-data/Excel/CharacterWeaponExcelTable.json');
    const jpCharWeaponList = JSON.parse(jpCharWeaponListJson);
    jpCharWeaponList.DataList.forEach((element) => {
        if(typeof(charWeaponListMap[element.Id]) !== 'undefined')
        {
            return;
        }
        charWeaponListMap[element.Id] = element;
    });
}

// Process the LocalizeCharProfileExcelTable file
const charProfileJson = fs.readFileSync('../orig/data/Excel/LocalizeCharProfileExcelTable.json');
const charProfile = JSON.parse(charProfileJson);
const charProfileMap = {};
charProfile.DataList.forEach((element) => {
    charProfileMap[element.CharacterId] = element;
});

if(includeJp)
{
    const jpCharProfileJson = fs.readFileSync('../orig/jp-data/Excel/LocalizeCharProfileExcelTable.json');
    const jpCharProfile = JSON.parse(jpCharProfileJson);
    jpCharProfile.DataList.forEach((element) => {
        if(typeof(charProfileMap[element.CharacterId]) !== 'undefined')
        {
            return;
        }
        charProfileMap[element.CharacterId] = element;
    });
}

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

let jpOnlyChar = false;

mainCharData.DataList.forEach(parseCharacter);

if(includeJp)
{
    // Process JP Character Data
    jpOnlyChar = true;

    const jpMainCharDataJson = fs.readFileSync('../orig/jp-data/Excel/CharacterExcelTable.json');
    const jpMainCharData = JSON.parse(jpMainCharDataJson);

    jpMainCharData.DataList.forEach(parseCharacter);
}


function parseCharacter(element)
{
    if(typeof(playableChars[element.Id]) !== 'undefined')
    {
        parseJpOnlyData(element.Id);
        return;
    }
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

    let prefix = '';
    if(jpOnlyChar)
    {
        prefix = 'jp-';
    }

    // Basic Character Data
    const thisChar = {
        Id: element.Id,
        DevName: element.DevName,
        JpOnly: jpOnlyChar,
        Name: localizeEtcMap[element.LocalizeEtcId].NameEn || localizeEtcMap[element.LocalizeEtcId].NameJp,
        BaseStar: element.DefaultStarGrade,
        Icon: element.CollectionTexturePath.substr(34),
        Rarity: element.Rarity,
        Type: (element.SquadType === 'Main' ? 'Striker' : 'Special'),
        School: element.School,
        DamageType: null,
        DefenseType: null,
        WeaponType: element.WeaponType,
        TacticRole: element.TacticRole,
        TacticRange: element.TacticRange,
        CombatStats: {
            HP1: characterStatExcel[element.Id].MaxHP1,
            HP100: characterStatExcel[element.Id].MaxHP100,
            Attack1: characterStatExcel[element.Id].AttackPower1,
            Attack100: characterStatExcel[element.Id].AttackPower100,
            Defense1: characterStatExcel[element.Id].DefensePower1,
            Defense100: characterStatExcel[element.Id].DefensePower100,
            Heal1: characterStatExcel[element.Id].HealPower1,
            Heal100: characterStatExcel[element.Id].HealPower100,
            Evasion: characterStatExcel[element.Id].DodgePoint,
            Accuracy: characterStatExcel[element.Id].AccuracyPoint,
            Critical: characterStatExcel[element.Id].CriticalPoint,
            CriticalResist: characterStatExcel[element.Id].CriticalResistPoint,
            CriticalDamageRate: characterStatExcel[element.Id].CriticalDamageRate,
            CriticalDamageResistRate: characterStatExcel[element.Id].CriticalDamageResistRate,
            Stability: characterStatExcel[element.Id].StabilityPoint,
            Range: characterStatExcel[element.Id].Range,
            AmmoCount: characterStatExcel[element.Id].AmmoCount,
            AmmoCost:characterStatExcel[element.Id].AmmoCost,
        },
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

    images[prefix + element.CollectionTexturePath] = "Character/" + thisChar.Icon;

    parseLocalisationStrings('Characters', element.Id, 'Name', localizeEtcMap[element.LocalizeEtcId], 'Name');

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
        Name: localizeSkillMap[exSkillData[1].LocalizeSkillId].NameEn || localizeSkillMap[exSkillData[1].LocalizeSkillId].NameJp,
    };

    parseLocalisationStrings('Characters', element.Id, 'Skills.Ex.Name', localizeSkillMap[exSkillData[1].LocalizeSkillId], 'Name');

    for(let i = 1; i <= 5; i++)
    {
        let level = 'Level' + i;
        thisChar.Skills.Ex[level] = {
            Description: localizeSkillMap[exSkillData[i].LocalizeSkillId].DescriptionEn || localizeSkillMap[exSkillData[i].LocalizeSkillId].DescriptionJp,
            Cost: exSkillData[i].SkillCost,
            LevelUpMats: recipeIngredientMap[recipeListMap[exSkillData[i].RequireLevelUpMaterial].RecipeIngredientId],
            Icon: exSkillData[i].IconName.substr(28),
        }
        parseLocalisationStrings('Characters', element.Id, 'Skills.Ex.' + level + '.Description', localizeSkillMap[exSkillData[i].LocalizeSkillId], 'Description');
        images[prefix + exSkillData[i].IconName] = "Skills/" + thisChar.Skills.Ex[level].Icon;
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
            Name: localizeSkillMap[thisSkillData[1].LocalizeSkillId].NameEn || localizeSkillMap[thisSkillData[1].LocalizeSkillId].NameJp
        }
        parseLocalisationStrings('Characters', element.Id, 'Skills.' + skillString + '.Name', localizeSkillMap[thisSkillData[1].LocalizeSkillId], 'Name');
        for(let j = 1; j <= 10; j++)
        {
            let level = 'Level' + j;
            thisChar.Skills[skillString][level] = {
                Description: localizeSkillMap[thisSkillData[j].LocalizeSkillId].DescriptionEn || localizeSkillMap[thisSkillData[j].LocalizeSkillId].DescriptionJp,
                LevelUpMats: recipeIngredientMap[recipeListMap[thisSkillData[j].RequireLevelUpMaterial].RecipeIngredientId],
                Icon: thisSkillData[j].IconName.substr(28),
            };
            parseLocalisationStrings('Characters', element.Id, 'Skills.' + skillString + '.' + level + '.Description', localizeSkillMap[thisSkillData[j].LocalizeSkillId], 'Description');
            images[prefix + thisSkillData[j].IconName] = "Skills/" + thisChar.Skills[skillString][level].Icon;
        }
    }

    // Parse Profile Data
    const profileData = charProfileMap[element.Id];
    if(!profileData)
    {
        throw 'Unable to find profile data for ' + element.Id;
    }

    const profileStrings = [
        'StatusMessage',
        'FamilyName',
        'FamilyNameRuby',
        'PersonalName',
        'PersonalNameRuby',
        'SchoolYear',
        'CharacterAge',
        'Birthday',
        'CharHeight',
        'ArtistName',
        'CharacterVoice',
        'Hobby',
        'WeaponName',
        'WeaponDesc',
        'ProfileIntroduction',
    ];
    profileStrings.forEach((stringKey) => {
        parseLocalisationStrings('Characters', element.Id, 'Profile.' + stringKey, profileData, stringKey);
    });

    playableChars[element.Id] = thisChar;
    if(jpOnlyChar)
    {
        parseJpOnlyData(element.Id);
    }
}

function parseJpOnlyData(characterId)
{
    const weapon = charWeaponListMap[characterId];
    if(!weapon)
    {
        throw 'Could not find weapon for ' + characterId;
    }
    playableChars[characterId].CharacterWeapon = {
        Icon: weapon.ImagePath.substr(24),
        Skill2Upgrade: {},
        AffinityBoost: null,
        AffinityBoostAmount: weapon.StatValue[2],
        CombatStats: {
            HP1: weapon.MaxHP,
            HP100: weapon.MaxHP100,
            Attack1: weapon.AttackPower,
            Attack100: weapon.AttackPower100,
            Heal1: weapon.HealPower,
            Heal100: weapon.HealPower100,
        }
    }
    switch(weapon.StatType[2])
    {
        case 'StreetBattleAdaptation_Base':
        {
            playableChars[characterId].CharacterWeapon.AffinityBoost = 'Urban';
            break;
        }
        case 'OutdoorBattleAdaptation_Base':
        {
            playableChars[characterId].CharacterWeapon.AffinityBoost = 'Outdoors';
            break;
        }
        case 'IndoorBattleAdaptation_Base':
        {
            playableChars[characterId].CharacterWeapon.AffinityBoost = 'Indoors';
            break;
        }
        default:
        {
            throw 'Unknown affinity boost ' + weapon.StatType[2] + ' for ' + characterId;
        }
    }
    const newPassive = skillExcelTableMap[weapon.AfterSkillGroupId[1]];
    if(typeof(newPassive) === 'undefined')
    {
        throw 'Unable to find skill data for ' + weapon.AfterSkillGroupId[1] + ' for ' + characterId;
    }

    playableChars[characterId].CharacterWeapon.Skill2Upgrade.Name = localizeSkillMap[newPassive[1].LocalizeSkillId].NameEn || localizeSkillMap[newPassive[1].LocalizeSkillId].NameJp,
    parseLocalisationStrings('Characters', characterId, 'Skills.Skill2Upgrade.Name', localizeSkillMap[newPassive[1].LocalizeSkillId], 'Name');

    for(let i = 1; i <= 10; i++)
    {
        let level = 'Level' + i;
        playableChars[characterId].CharacterWeapon.Skill2Upgrade[level] = {
            Description: localizeSkillMap[newPassive[i].LocalizeSkillId].DescriptionEn || localizeSkillMap[newPassive[i].LocalizeSkillId].DescriptionJp,
        };
        parseLocalisationStrings('Characters', characterId, 'Skills.Skill2Upgrade.' + level + '.Description', localizeSkillMap[newPassive[i].LocalizeSkillId], 'Description');
    }
    images['jp-' + weapon.ImagePath] = 'CharacterWeapons/' + playableChars[characterId].CharacterWeapon.Icon;
}

fs.mkdirSync('../public/import/Character', {recursive: true});
fs.mkdirSync('../public/import/Skills', {recursive: true});
fs.mkdirSync('../public/import/Icons', {recursive: true});
fs.mkdirSync('../public/import/Items', {recursive: true});
fs.mkdirSync('../public/import/Equipment', {recursive: true});
fs.mkdirSync('../public/import/CharacterWeapons', {recursive: true});

images['UIs/01_Common/03_NonEquipment/Currency_Icon_Gold'] = 'Items/Currency_Icon_Gold';

images['UIs/01_Common/11_SchoolIcon/School_Icon_ABYDOS'] = 'Icons/Abydos';
images['UIs/01_Common/11_SchoolIcon/School_Icon_GEHENNA'] = 'Icons/Gehenna';
images['UIs/01_Common/11_SchoolIcon/School_Icon_HYAKKIYAKO'] = 'Icons/Hyakkiyako';
images['UIs/01_Common/11_SchoolIcon/School_Icon_MILLENNIUM'] = 'Icons/Millennium';
images['UIs/01_Common/11_SchoolIcon/School_Icon_REDWINTER'] = 'Icons/RedWinter';
images['UIs/01_Common/11_SchoolIcon/School_Icon_SHANHAIJING'] = 'Icons/Shanhaijing';
images['UIs/01_Common/11_SchoolIcon/School_Icon_TRINITY'] = 'Icons/Trinity';
images['UIs/01_Common/11_SchoolIcon/School_Icon_VALKYRIE'] = 'Icons/Valkyrie';
images['jp-UIs/01_Common/11_SchoolIcon/School_Icon_ARIUS'] = 'Icons/Arius';
images['jp-UIs/01_Common/11_SchoolIcon/School_Icon_ETC'] = 'Icons/Etc';
images['jp-UIs/01_Common/11_SchoolIcon/School_Icon_SRT'] = 'Icons/SRT';

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
            console.log('Could not find ' + from + ' => ' + to);
            fs.copyFileSync('../orig/UIs/01_Common/03_NonEquipment/Material_Icon_Error.png', '../public/import/' + to + '.png');
        }
    }
}


fs.mkdirSync('../src/assets/computed/', {recursive: true});
fs.mkdirSync('../public/import/files/', {recursive: true});
fs.writeFileSync('../src/assets/computed/charlist.json', JSON.stringify(playableChars, null, '\t'));
fs.writeFileSync('../public/import/files/charlist.json', JSON.stringify(playableChars, null, '\t'));
fs.writeFileSync('../src/assets/computed/itemlist.json', JSON.stringify(itemMap, null, '\t'));
fs.writeFileSync('../public/import/files/itemlist.json', JSON.stringify(itemMap, null, '\t'));
fs.writeFileSync('../src/assets/computed/localisations.json', JSON.stringify(localisationOutput, null, '\t'));
fs.writeFileSync('../public/import/files/localisations.json', JSON.stringify(localisationOutput, null, '\t'));
fs.writeFileSync('../src/assets/computed/missingLocalisation.json', JSON.stringify(missingLocalisationOutput, null, '\t'));
fs.writeFileSync('../src/assets/manualLocalisation.json', JSON.stringify(manualLocalisationOutput, null, '\t'));
