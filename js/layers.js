addLayer("m", {
    name: "multiplier", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ff9999",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "multiplier", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('m', 21)) mult = mult.times(2)
        if (hasUpgrade('m', 23)) mult = mult.times(upgradeEffect('m', 23))
        if (hasMilestone('r', 0)) mult = mult.times(2)
        if (hasUpgrade('r', 11)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        if (hasMilestone('r',2)) return 0.001
        return 0},
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: gain Multiplier", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Beginning Multiplier",
            description: "Doubles point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Triplicator",
            description: "Triples point gain.",
            cost: new Decimal(4),
        },
        13: {
            title: "Unlock the Multiplier",
            description: "Makes multiplier actually multiply points.",
            cost: new Decimal(9),
            effect() {
                if (hasUpgrade('r', 13)) return player[this.layer].points.add(1).log(8.88).add(1)
                return player[this.layer].points.add(1).log(10).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        21: {
            title: "Base Improvement",
            description: "Doubles multiplier gain.",
            cost: new Decimal(25),
        },
        22: {
            title: "Quadrupler",
            description: "Multiplies point gain by 4.",
            cost: new Decimal(100),
        },
        23: {
            title: "Overpower",
            description: "Further synergizes multiplier and points.",
            cost: new Decimal(240),
            effect() {
                if (hasUpgrade('r', 13)) return player.points.add(1).log(92).add(1)
                return player.points.add(1).log(100).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
    layerShown(){return true}
})

addLayer("r", {
    name: "rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#9999ff",
    requires: new Decimal(400), // Can be a function that takes requirement increases into account
    resource: "rebirth", // Name of prestige currency
    baseResource: "multiplier", // Name of resource prestige is based on
    baseAmount() {return player['m'].points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: 4,
    exponent: 0.777, // Prestige currency exponent
    canBuyMax() {return true},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Rebirth", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "1 Rebirth",
            effectDescription: "Point gain is tripled, and Multiplier gain is doubled.",
            done() { return player['r'].points.gte(1) }
        },
        1: {
            requirementDescription: "2 Rebirths",
            effectDescription: "Rebirths boost Multiplier gain.",
            done() { return player['r'].points.gte(2) },
            effect() {
                return player['r'].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        2: {
            requirementDescription: "4 Rebirths",
            effectDescription: "Passively gain 1/1000 of your Multiplier gain every second.",
            done() { return player['r'].points.gte(4) },
        },
        3: {
            requirementDescription: "7 Rebirths",
            effectDescription: "Unlock the third row of Multiplier Upgrades and the second row of Rebirth upgrades [NOT IMPLEMENTED YET].",
            done() { return player['r'].points.gte(7) }
        },
    },
    upgrades: {
    11: {
        title: "New Life",
        description: "Applies the First Rebirth Milestone again.",
        cost: new Decimal(2),
    },
    12: {
        title: "A Point Reborn",
        description: "Applies the Second Rebirth Milestone to Points, with an improved effect.",
        cost: new Decimal(3),
        effect() {
            return player['r'].points.add(1).pow(0.7)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
    },
    13: {
        title: "Multiplied Improvements",
        description: "Slightly improves the formulae for Multiplier Upgrades 13 and 23.",
        cost: new Decimal(5),
    },
    }
})