import { useSettingsStorage } from '../stores/SettingsStorage.js';

const settings = useSettingsStorage();
const includeJpOnly = settings.settings.IncludeJpOnly;

export function getRegionSettings()
{
    const regionSettings = {};
    if(includeJpOnly)
    {
        regionSettings.MaxLevel = 78;
        regionSettings.UniqueWeaponsAvailable = true;
        regionSettings.UniqueWeaponMaxStar = 3;
        regionSettings.MaxEquipLevel = 6;
        regionSettings.MaxBond = 50;
    }
    else
    {
        regionSettings.MaxLevel = 73;
        regionSettings.UniqueWeaponsAvailable = false;
        regionSettings.UniqueWeaponMaxStar = 0;
        regionSettings.MaxEquipLevel = 5;
        regionSettings.MaxBond = 20;
    }
    return regionSettings;
}
