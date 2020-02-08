const weights = {
    "common": 8,
    "uncommon": 64,
    "rare": 27,
    "very rare": 8,
    "legendary": 1,
};
function getItems(numberOfItems, filterFunc) {
    let items = parse(itemsCSV, "\t");
    let itemsByRarity = groupBy(items, item => item.rarity, filterFunc);
    let rarityQuantities = createDistribution(weights, numberOfItems);
    let selectedItems = [];
    for (let rarity in rarityQuantities) {
        selectedItems = selectedItems.concat(selectItemsWithoutReplace(itemsByRarity[rarity] || [], rarityQuantities[rarity]));
    }
    return orderBy(selectedItems, item => parseInt(item.price));
}
function groupBy(array, keyFunc, filterFunc) {
    return array.reduce((dictionary, item) => {
        if (filterFunc(item)) {
            let key = keyFunc(item);
            dictionary[key] = dictionary[key] || [];
            dictionary[key].push(item);
        }
        return dictionary;
    }, {});
}
function orderBy(array, keyFunc) {
    return array.sort((a, b) => keyFunc(a) > keyFunc(b) ? 1 : -1);
}
function parse(csv, delimeter) {
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
function createDistribution(weights, numberOfItems) {
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
function selectItemsWithoutReplace(items, numberOfItemsToSelect) {
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
const itemsCSV = `name	price	rarity
Helm of Comprehend Languages	500	uncommon
Driftglobe	750	uncommon
Trident of Fish Command	800	uncommon
Cap of Water Breathing	1000	uncommon
Eversmoking Bottle	1000	uncommon
Quiver of Ehlonna	1000	uncommon
Ioun Stone Sustenance	1000	rare
Ring of Warmth	1000	uncommon
Goggles of Night	1500	uncommon
Horseshoes of the Zephyr	1500	very rare
Mariner's Armor	1500	uncommon
Necklace of Adaption	1500	uncommon
Ring of Water Walking	1500	uncommon
Wand of Magic Detection	1500	uncommon
Wand of Secrets	1500	uncommon
Gloves of Swimming and Climbing	2000	uncommon
Heward's Handy Haversack	2000	rare
Rope of Climbing	2000	uncommon
Ring of Feather Falling	2000	rare
Boots of Elvenkind	2500	uncommon
Eyes of Minute Seeing	2500	uncommon
Eyes of the Eagle	2500	uncommon
Ring of Jumping	2500	uncommon
Dimensional Shackles	3000	rare
Eyes of Charming	3000	uncommon
Medallion of Thoughts	3000	uncommon
Ring of Swimming	3000	uncommon
Bag of Holding	4000	uncommon
Boots of Levitation	4000	rare
Ring of Animal Influence	4000	rare
Boots of Striding and Springing	5000	uncommon
Cloak of Arachnida	5000	very rare
Cloak of Elvenkind	5000	uncommon
Gloves of Thievery	5000	uncommon
Hat of Disguise	5000	uncommon
Horseshoes of Speed	5000	rare
Immovable Rod	5000	uncommon
Lantern of Revealing	5000	uncommon
Periapt of Health	5000	uncommon
Periapt of Proof Against Poison	5000	rare
Slippers of Spider Climbing	5000	uncommon
Cloak of the Bat	6000	rare
Cloak of the Manta Ray	6000	uncommon
Ring of X-Ray Vision	6000	rare
Cape of the Mountebank	8000	rare
Portable Hole	8000	rare
Apparatus of Kwalish	10000	legendary
Boots of the Winterlands	10000	uncommon
Folding Boat	10000	rare
Ring of Invisibility	10000	legendary
Helm of Telepathy	12000	uncommon
Cube of Force	16000	rare
Ring of Mind Shielding	16000	uncommon
Rod of Rulership	16000	rare
Mirror of Life Trapping	18000	very rare
Amulet of Proof Against Detection and Location	20000	uncommon
Robe of Eyes	30000	rare
Gem of Seeing	32000	rare
Plate Armor of Etherealness	48000	legendary
Spell Scroll Level 0	10	common
Ammunition +1 (each)	25	uncommon
Potion of Healing	50	common
Quaal's Feather Token Anchor	50	rare
Spell Scroll Level 1	60	common
Philter of Love	90	uncommon
Ammunition +2 (ea)	100	rare
Potion of Poison	100	uncommon
Dust of Dryness (1 pellet)	120	uncommon
Elixir of Health	120	rare
Keoghtom's Ointment (Per dose)	120	uncommon
Spell Scroll Level 2	120	uncommon
Potion of Fire Breath	150	uncommon
Potion of Greater Healing	150	uncommon
Potion of Climbing	180	common
Potion of Heroism	180	rare
Potion of Invisibility	180	very rare
Potion of Mind Reading	180	rare
Potion of Water Breathing	180	uncommon
Scroll of Protection	180	rare
Nolzur's Marvelous Pigments	200	very rare
Potion of Animal Friendship	200	uncommon
Spell Scroll Level 3	200	uncommon
Quaal's Feather Token Fan	250	rare
Quaal's Feather Token Whip	250	rare
Potion of Diminution	270	rare
Potion of Growth	270	uncommon
Dust of Disappearance	300	uncommon
Necklace of Fireballs (One bead)	300	rare
Potion of Gaseous Form	300	rare
Potion of Resistance	300	uncommon
Universal Solvent	300	legendary
Spell Scroll Level 4	320	rare
Ammunition +3 (ea)	400	very rare
Potion of Speed	400	very rare
Sovereign Glue	400	legendary
Horn of Blasting	450	rare
Potion of Superior Healing	450	very rare
Dust of Sneezing and Choking	480	uncommon
Necklace of Fireballs (Two beads)	480	rare
Oil of Slipperiness	480	uncommon
Potion of Flying	500	very rare
Arrow of Slaying (ea)	600	very rare
Spell Scroll Level 5	640	rare
Bead of Force	960	rare
Elemental Gem	960	uncommon
Necklace of Fireballs (Three beads)	960	rare
Potion of Clairvoyance	960	rare
Potion of Vitality	960	very rare
Spell Scroll Level 6	1280	very rare
Potion of Supreme Healing	1350	very rare
Chime of Opening	1500	rare
Necklace of Fireballs (Four beads)	1600	rare
Oil of Etherealness	1920	rare
Ioun Stone Absorption	2400	very rare
Spell Scroll Level 7	2560	very rare
Quaal's Feather Token Bird	3000	rare
Quaal's Feather Token Swan Boat	3000	rare
Oil of Sharpness	3200	very rare
Necklace of Fireballs (Five beads)	3840	rare
Potion of Invulnerability	3840	rare
Gem of Brightness	5000	uncommon
Spell Scroll Level 8	5120	very rare
Deck of Illusions	6120	uncommon
Necklace of Fireballs (Six beads)	7680	rare
Spell Scroll Level 9	10240	legendary
Ioun Stone Greater Absorption	31000	legendary
Rod of Absorption	50000	very rare
Talisman of Ultimate Evil	61440	legendary
Talisman of Pure Good	71680	legendary
Vicious Weapon	350	rare
Adamantine Armor	500	uncommon
Mithral Armor	800	uncommon
+1 Weapon	1000	uncommon
Sword of Life-Stealing	1000	rare
Ioun Stone Protection	1200	rare
Wand of the War Mage +1	1200	uncommon
Bracers of Archery	1500	uncommon
Circlet of Blasting	1500	uncommon
Javelin of Lightning	1500	uncommon
Prayer Bead - Smiting	1500	rare
Wind Fan	1500	uncommon
Sword of Sharpness	1700	rare
Staff of the Adder	1800	uncommon
Dancing Sword	2000	very rare
Glamoured Studded Leather	2000	rare
Pipes of the Sewers	2000	uncommon
Prayer Bead - Bless	2000	rare
Saddle of theCavalier	2000	uncommon
Sword of Wounding	2000	rare
Frost Brand	2200	very rare
Dagger of Venom	2500	rare
Gloves of Missile Snaring	3000	uncommon
Ioun Stone Agility	3000	very rare
Ioun Stone Fortitude	3000	very rare
Ioun Stone Insight	3000	very rare
Ioun Stone Intellect	3000	very rare
Ioun Stone Leadership	3000	very rare
Ioun Stone Strength	3000	very rare
Staff of Withering	3000	rare
Cloak of Protection	3500	uncommon
Oathbow	3500	very rare
Ring of Protection	3500	rare
+2 Weapon	4000	rare
Boots of Speed	4000	rare
Dragon Scale Mail	4000	very rare
Elven Chain	4000	rare
Ioun Stone Regeneration	4000	legendary
Iron Bands of Bilarro	4000	rare
Prayer Bead - Curing	4000	rare
Rope of Entanglement	4000	rare
Wand of Enemy Detection	4000	rare
Luckstone	4200	uncommon
Wand of the WarMage +2	4800	rare
Flame Tongue	5000	rare
Periapt of Wound Closure	5000	uncommon
Ring of Evasion	5000	rare
Ring of the Ram	5000	rare
Tentacle Rod	5000	rare
Animated Shield	6000	very rare
Armor of Resistance	6000	rare
Arrow-Catching Shield 	6000	rare
Belt of Dwarvenkind	6000	rare
Bracers of Defense	6000	rare
Ioun Stone Reserve	6000	rare
Pearl of Power	6000	uncommon
Pipes of Haunting	6000	uncommon
Ring of Resistance	6000	rare
Robe of Scintillating Colors	6000	very rare
Scimitar of Speed	6000	very rare
Shield of Missile Attraction	6000	rare
Giant Slayer	7000	rare
Mace of Smiting	7000	rare
Brooch of Shielding	7500	uncommon
Amulet of Health	8000	rare
Dragon Slayer	8000	rare
Gauntlets of Ogre Power	8000	uncommon
Headband of Intellect	8000	uncommon
Mace of Disruption	8000	rare
Mace of Terror	8000	rare
Nine Lives Stealer (Fully Charged)	8000	very rare
Wand of Magic Missiles	8000	uncommon
Wand of Web	8000	uncommon
Staff of Thunder and Lightning	10000	very rare
Wand of Binding	10000	rare
Wand of Fear	10000	rare
Ioun Stone Awareness	12000	rare
Rod of the Pact Keeper +1	12000	rare
Staff of Charming	12000	rare
Sunblade	12000	rare
Staff of Healing	13000	rare
Ring of Shooting Stars	14000	very rare
Ioun Stone Mastery	15000	legendary
+3 Weapon	16000	very rare
Hammer of Thunderbolts	16000	legendary
Rod of the Pact Keeper +2	16000	rare
Staff of Fire	16000	very rare
Staff of Swarming Insects	16000	rare
Wand of Paralysis	16000	rare
Ring of Fire Elemental Command	17000	legendary
Dwarven Thrower	18000	very rare
Wand of the War Mage +3	19200	very rare
Efreeti Chain	20000	legendary
Ring of Free Action	20000	rare
Sentinel Shield	20000	uncommon
Staff of Striking	21000	very rare
Ring of Spell Storing	24000	rare
Vorpal Sword	24000	legendary
Ring of Water Elemental Command	25000	legendary
Rod of Alertness	25000	very rare
Staff of Frost	26000	very rare
Instrument of the Bards - FochulanBandlore	26500	uncommon
Instrument of the Bards - Mac-FuirmidhCittern	27000	uncommon
Rod of Lordly Might	28000	legendary
Rod of the Pact Keeper +3	28000	very rare
Instrument of theBards - Doss Lute	28500	uncommon
Instrument of theBards - CanaithMandolin	30000	rare
Mantle of Spell Resistance	30000	rare
Ring of Spell Turning	30000	legendary
Prayer Bead - Favor	32000	rare
Wand of Fireballs	32000	rare
Wand of Lightning Bolts	32000	rare
Wand of Polymorph	32000	very rare
Instrument of the Bards - Cli Lyre	35000	rare
Scarab of Protection	36000	legendary
Sword of Answering	36000	legendary
Staff of the Woodlands	44000	rare
Spellguard Shield	50000	very rare
Cloak of Displacement	60000	rare
Robe of Stars	60000	very rare
Weapon of Warning	60000	uncommon
Prayer Bead - Wind Walking	96000	rare
Instrument of the Bards - Anstruth Harp	109000	very rare
Instrument of the Bards - Ollamh Harp	125000	legendary
Prayer Bead - Summons	128000	rare
Holy Avenger	165000	legendary
Ivory Goat (Travail)	400	rare
Goldean Lion (ea)	600	rare
Ivory Goat(Traveling)	1000	rare
Staff of the Python	2000	uncommon
Onyx Dog	3000	rare
Silver Raven	5000	uncommon
Silver Horn ofValhalla	5600	rare
Marble Elephant	6000	rare
Bowl of Commanding Water Elementals	8000	rare
Brazier of Commanding Fire Elementals	8000	rare
Censer of Controlling Air Elementals	8000	rare
Stone of Controlling Earth Elementals	8000	rare
Brass Horn of Valhalla	8400	rare
Bronze Horn of Valhalla	11200	Very rare
Iron Horn of Valhalla	14000	legendary
Ivory Goat (Terror)	20000	rare`;
