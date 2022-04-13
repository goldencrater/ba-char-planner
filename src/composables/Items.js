import itemList from '../assets/computed/itemlist.json'

export function getItem(itemId)
{
    return itemList[itemId];
}

export function getItems(items)
{
    const fullItems = [];
    items.forEach((item) => {
        const thisItem = getItem(item.ItemId);
        if(typeof(item.Quantity) !== 'undefined')
        {
            thisItem.Quantity = item.Quantity;
        }
        fullItems.push(thisItem);
    })
    return fullItems;
}

export function createCurrencyItem(amount)
{
    if(amount > 10000)
    {
        amount = Math.floor(amount / 1000) + 'k';
    }
    const currencyItem = {
        Id: 0,
        Name: "Credits",
        Rarity: "N",
        Icon: "Currency_Icon_Gold",
        Quantity: amount,
    };
    return currencyItem;
}
