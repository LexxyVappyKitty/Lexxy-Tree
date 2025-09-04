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
        if (hasUpgrade('m', 33)) mult = mult.times(3)    
        if (hasMilestone('m', 2)) mult = mult.times(1.44)
        if (hasMilestone('m', 4)) gain = gain.times(2)

        if (hasUpgrade('mo', 11)) mult = mult.times(1.5)
        if (getBuyableAmount('mo',22).gte(1)) mult = mult.times(buyableEffect('mo',22))

        if (hasMilestone('r', 0)) mult = mult.times(2)
        if (hasUpgrade('r', 11)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('r', 21)) mult = mult.add(0.025)
        return mult
    },
    passiveGeneration() {
        mult = new Decimal(0)
        
        if (hasMilestone('r',2)) mult = mult.add(0.001)
        if (getBuyableAmount('mo',11).gte(1)) mult = mult.add(buyableEffect('mo',11))

        return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: gain Multiplier", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
doReset(resettingLayer){
    if (hasMilestone('r',4)) layerDataReset(this.layer, ["milestones"])
},
    milestones: {
        0: {
            requirementDescription: "Jackpot Central - 7,777,777 Points",
            effectDescription: "Money gain increased by 57%.",
            unlocked() {return hasUpgrade('r', 22)},
            done() { return player.points.gte(7777777) && hasUpgrade('r', 22) }
        },
        1: {
            requirementDescription: "Discounts I - 50,000,000 Points",
            effectDescription: "Rebirth price is halved.",
            unlocked() {return hasUpgrade('r', 22)},
            done() { return player.points.gte(new Decimal("5e7")) && hasUpgrade('r', 22) }
        },
        2: {
            requirementDescription: "Quartet's Pride - 444,444,444 Points",
            effectDescription: "Multiplier gain increased by 44%.",
            unlocked() {return hasUpgrade('r', 22)},
            done() { return player.points.gte(new Decimal("444444444")) && hasUpgrade('r', 22) }
        },
        3: {
            requirementDescription: "Snapped Fortune - 3e9 Points",
            effectDescription: "Rebirth price is halved again.",
            unlocked() {return hasUpgrade('r', 22)},
            done() { return player.points.gte(new Decimal("3e9")) && hasUpgrade('r', 22) }
        },
        4: {
            requirementDescription: "Dialogics - 1e10 Points",
            effectDescription: "Money, Multiplier, and Points are all doubled.",
            unlocked() {return hasUpgrade('r', 22)},
            done() { return player.points.gte(new Decimal("1e10")) && hasUpgrade('r', 22) }
        },
    },

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
        31: {
            title: "Underscore",
            description: "Slightly improves the Rebirth Price formula.",
            cost: new Decimal(40000),
                    unlocked() {return hasMilestone('r', 3)},
        },
        32: {
            title: "Quintupler",
            description: "Multiplies point gain by 5.",
            cost: new Decimal(80000),
                    unlocked() {return hasMilestone('r', 3)},
        },
        33: {
            title: "A Baseline of Grinding",
            description: "Foreshadows the Scaling, triples Multiplier.",
            cost: new Decimal(133337),
                    unlocked() {return hasMilestone('r', 3)},
        },
        34: {
            title: "Fractal Geometry I",
            description: "Points boost points, though the formula is weaker than anticipated.",
            effect() {
                return player.points.add(1).log(75).add(2)
            },
            cost: new Decimal(888888),
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
                    unlocked() {return hasMilestone('r', 3)},
        },
        35: {
            title: "Capitalism",
            description: "Unlocks Money, a capitalistic layer besides rebirths.",
            cost: new Decimal(2000000),
                    unlocked() {return hasMilestone('r', 3)},
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
        if (hasMilestone('m', 1)) mult = mult.times(2)
	    if (hasMilestone('m', 3)) mult = mult.times(2)
        if (getBuyableAmount('mo',12).gte(1)) mult = mult.times(buyableEffect('mo',12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('m', 31)) mult = mult.add(0.05)
        return mult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Rebirth", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "Consolation Boost - 1 Rebirth",
            effectDescription: "Point gain is tripled, and Multiplier gain is doubled.",
            done() { return player['r'].points.gte(1) }
        },
        1: {
            requirementDescription: "Unlock Rebirth - 2 Rebirths",
            effectDescription: "Rebirths boost Multiplier gain.",
            done() { return player['r'].points.gte(2) },
            effect() {
                return player['r'].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        2: {
            requirementDescription: "Micropassive - 4 Rebirths",
            effectDescription: "Passively gain 1/1000 of your Multiplier gain every second.",
            done() { return player['r'].points.gte(4) },
        },
        3: {
            requirementDescription: "Extension - 7 Rebirths",
            effectDescription: "Unlock the third row of Multiplier Upgrades and the second row of Rebirth upgrades.",
            done() { return player['r'].points.gte(7) }
        },
        4: {
            requirementDescription: "Qualitree - 15 Rebirths",
            effectDescription: "Multiplier Milestones no longer reset on Rebirth.",
            unlocked() {return hasUpgrade('r', 23)},
            done() { return player['r'].points.gte(15) && hasUpgrade('r', 23) }
        },
        5: {
            requirementDescription: "Profit! - 20 Rebirths",
            effectDescription: "Doubles Money gain.",
            unlocked() {return hasUpgrade('r', 23)},
            done() { return player['r'].points.gte(20) && hasUpgrade('r', 23) }
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
    21: {
        title: "Formulaic Boost",
        description: "Slightly improves the multiplier formula.",
        cost: new Decimal(6),
        unlocked() {return hasMilestone('r', 3)},
    },
    22: {
        title: "Punctual Mile Markers",
        description: "Unlocks various milestones for Points to grind for.",
        cost: new Decimal(10),
        unlocked() {return hasMilestone('r', 3)},
    },
    23: {
        title: "Reborn Mile Markers",
        description: "Unlocks some more Rebirth milestones for QoL.",
        cost: new Decimal(14),
        unlocked() {return hasMilestone('r', 3)},
    },
    24: {
        title: "What's next?",
        description: "Unlock the next row.",
        cost: new Decimal(18),
        unlocked() {return hasMilestone('r', 3)},
    },
    }
})

addLayer("mo", {
    name: "money", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "$", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#339933",
    requires: new Decimal(1000000), // Can be a function that takes requirement increases into account
    resource: "money", // Name of prestige currency
    baseResource: "multiplier", // Name of resource prestige is based on
    baseAmount() {return player['m'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    layerShown() {return hasUpgrade('m', 35) || player['mo'].points.gte(1)},
    canBuyMax() {return true},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasMilestone('m', 0)) mult = mult.times(1.57)
	    if (hasMilestone('m', 4)) mult = mult.times(2)
        if (hasMilestone('r', 5)) mult = mult.times(2)
        if (hasUpgrade('mo', 11)) mult = mult.times(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    
    buyables: {
    11: {
        cost(x) { return new Decimal(10).pow(x.times(0.1).add(1)) },
        title: "Autospawner",
        display(x) { return "Multiplier Passive Generation increased.<br>"+x+" Owned<br>Cost: "+this.cost(x)+"<br>Current effect: +x"+this.effect(x) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        effect(x) {return x.times(0.001)},
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        
    },
    12: {
        cost(x) { return new Decimal(25).pow(x.times(0.5).add(1)) },
        title: "Discount Card",
        display() { return "Rebirth prices slightly reduced.<br>"+x+" Owned<br>Cost: "+this.cost(x)+"<br>Current effect: /"+this.effect(x)},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        effect(x) {return x.times(0.2).add(1)},
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
    },
    21: {
        cost(x) { return new Decimal(180).pow(x.times(0.05).add(1)) },
        title: "Point Farm",
        display() { return "Points increased by 25%.<br>"+x+" Owned<br>Cost: "+this.cost(x)+"<br>Current effect: +x"+this.effect(x)},
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        effect(x) {return x.times(0.25).add(1)},
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
    },
    22: {
        cost(x) { return new Decimal(700).pow(x.times(0.04).add(1)) },
        title: "Multiplier Farm",
        display() { return "Multiplier increased by 10%.<br>"+x+" Owned<br>Cost: "+this.cost(x)+"<br>Current effect: +x"+this.effect(x) },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        effect(x) {return x.times(0.1).add(1)},
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
    },
},

    upgrades: {
    11: {
        title: "Buying Money with Money",
        description: "Money increased by 50%.",
        cost: new Decimal(20),
    },
    12: {
        title: "Buying Multiplier with Money",
        description: "Multiplier increased by 50%.",
        cost: new Decimal(100),
    },
    13: {
        title: "Buying Points with Money",
        description: "Points increased by 250%.",
        cost: new Decimal(256),
    },
    },
    
})