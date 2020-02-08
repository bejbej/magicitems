type Func<Tin, Tout> = (Tin) => Tout;
type Dictionary<T> = { [id:string]: T };
type Item = {
    name: string;
    price: string;
    rarity: string;
};

const weights = {
    "common": 8,
    "uncommon": 64,
    "rare": 27,
    "very rare": 8,
    "legendary": 1,
}

function getItems(numberOfItems: number, filterFunc: Func<Item, boolean>) {
    let items: Item[] = parse(itemsCSV, "\t");
    let itemsByRarity = groupBy(items, item => item.rarity, filterFunc);
    let rarityQuantities = createDistribution(weights, numberOfItems);
    let selectedItems = [];
    for (let rarity in rarityQuantities) {
        selectedItems = selectedItems.concat(selectItemsWithoutReplace(itemsByRarity[rarity] || [], rarityQuantities[rarity]));
    }
    return orderBy(selectedItems, item => parseInt(item.price));
}

function groupBy<T>(array: T[], keyFunc: Func<T, string>, filterFunc: Func<T, boolean>): Dictionary<T[]> {
    return array.reduce((dictionary, item) => {
        if (filterFunc(item)) {
            let key = keyFunc(item);
            dictionary[key] = dictionary[key] || [];
            dictionary[key].push(item);
        }
        return dictionary;
    }, {});
}

function orderBy<T>(array: T[], keyFunc: Func<T, string | number>): T[] {
    return array.sort((a, b) => keyFunc(a) > keyFunc(b) ? 1 : -1);
}

function parse(csv: string, delimeter?: string): Item[] {
    delimeter = delimeter || ",";
    let lines = csv.split("\n");
    let keys = lines.shift().split(delimeter);
    return lines.reduce((array, line) => {
        if (line.trim().length === 0) {
            return array;
        }
        let values = line.split(delimeter);
        let item = {};
        for (let i = 0; i < keys.length; ++i) {
            item[keys[i]] = values[i];
        }
        array.push(item);
        return array;
    }, []);
}

function createDistribution(weights: Dictionary<number>, numberOfItems: number): Dictionary<number> {
    let distribution = [];
    for (let key in weights) {
        let weight = weights[key];
        for (let i = 0; i < weight; ++i) {
            distribution.push(key);
        }
    }

    let selectedDistribution = {};
    for (let i = 0; i < numberOfItems; ++i) {
        let key = distribution[Math.floor(Math.random() * distribution.length)];
        selectedDistribution[key] = selectedDistribution[key] || 0;
        ++selectedDistribution[key];
    }
    return selectedDistribution;
}

function selectItemsWithoutReplace<T>(items: T[], numberOfItemsToSelect: number): T[] {
    if (items.length < numberOfItemsToSelect) {
        return items;
    }

    let length = items.length;
    for (let i = 0; i < numberOfItemsToSelect; ++i) {
        let random = Math.floor(Math.random() * (length - 1));
        let temp = items[i];
        items[i] = items[random];
        items[random] = temp;
    }
    return items.slice(0, numberOfItemsToSelect);
}