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
    MaxLevel: 73,
    UniqueWeaponsAvailable: false,
    UniqueWeaponMaxStar: 0,
    MaxEquipLevel: 5,
    MaxBond: 20,
};
