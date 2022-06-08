import { useSettingsStorage } from '../stores/SettingsStorage.js';

const settings = useSettingsStorage();
const includeJpOnly = settings.settings.IncludeJpOnly;

export function getRegionSettings()
{
    if(includeJpOnly)
    {
        return jpRegionSettings;
    }
    else
    {
        return globalRegionSettings
    }
}

export function getJpRegionSettings()
{
    return jpRegionSettings;
}

export function getGlobalRegionSettings()
{
    return globalRegionSettings;
}

const jpRegionSettings = {
    MaxLevel: 80,
    UniqueWeaponsAvailable: true,
    UniqueWeaponMaxStar: 3,
    MaxEquipLevel: 7,
    MaxBond: 50,
};

const globalRegionSettings = {
    MaxLevel: 75,
    UniqueWeaponsAvailable: true,
    UniqueWeaponMaxStar: 3,
    MaxEquipLevel: 6,
    MaxBond: 50,
};
