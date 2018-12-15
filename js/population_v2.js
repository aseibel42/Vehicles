// population_v2.js
// Written primarily by Carlos Venegas
// Last modified on 12/13/18

// Predefined objects with default values for a specific type of population. 
const TRAFFIC = {
    tag: "traffic",
    size: 12,
    sensorTypes: [SIGNAL_TYPE.HAZARD, SIGNAL_TYPE.HAZARD],
    signal: SIGNAL_TYPE.HAZARD,
    color: [100, 100, 100],
    brain: [AVOID, CURIOUSITY]
}

const FOOD_FINDER = {
    tag: "food",
    size: 10,
    sensorTypes: [SIGNAL_TYPE.FOOD, SIGNAL_TYPE.HAZARD],
    signal: null,
    color: [255, 222, 173],
    brain: [COLLECT, AVOID]
}

const PREDATOR = {
    tag: "predator",
    size: 12,
    sensorTypes: [SIGNAL_TYPE.FOOD, SIGNAL_TYPE.FOOD],
    signal: SIGNAL_TYPE.HAZARD,
    color: [130, 107, 43],
    brain: [COLLECT, AGGRESSION]
}

const PREY = {
    tag: "prey",
    size: 10,
    sensorTypes: [SIGNAL_TYPE.HAZARD, SIGNAL_TYPE.HAZARD],
    signal: SIGNAL_TYPE.FOOD,
    color: [170, 150, 150],
    brain: [AVOID, FEAR]
}

const CLUSTER1 = {
    tag: "cluster",
    size: 12,
    sensorTypes: [SIGNAL_TYPE.LIGHT, SIGNAL_TYPE.FOOD, SIGNAL_TYPE.HAZARD],
    signal: SIGNAL_TYPE.LIGHT,
    color: [230, 230, 100],
    brain: [LIKE, AVOID, AVOID]
}

const CLUSTER2 = {
    tag: "cluster",
    size: 12,
    sensorTypes: [SIGNAL_TYPE.LIGHT, SIGNAL_TYPE.FOOD, SIGNAL_TYPE.HAZARD],
    signal: SIGNAL_TYPE.FOOD,
    color: [60, 230, 60],
    brain: [AVOID, LIKE, AVOID]
}

const CLUSTER3 = {
    tag: "cluster",
    size: 12,
    sensorTypes: [SIGNAL_TYPE.LIGHT, SIGNAL_TYPE.FOOD, SIGNAL_TYPE.HAZARD],
    signal: SIGNAL_TYPE.HAZARD,
    color: [230, 60, 60],
    brain: [AVOID, AVOID, LIKE]
}

// const EXPLORER = {
//   tag: "explorer",
//   size: 10, 
//   sensorTypes: [SIGNAL_TYPE.LIGHT, SIGNAL_TYPE.FOOD, SIGNAL_TYPE.HAZARD],
//   signal: SIGNAL_TYPE.LIGHT,
//   color: [130, 200, 255],
//   brain: [CURIOUSITY, CURIOUSITY, CURIOUSITY]
// }


// Population class definition
// A Population object contains a set of vehicles, along with a set of traits that are shared
// by all vehicles and a gene pool that contains all genes from all genomes
class Population {

    constructor(size, traits, mutationRate) {
        this.tag = traits.tag;
        this.size = size;
        this.agentSize = traits.size;
        this.sensorTypes = traits.sensorTypes;
        this.brains = traits.brain;
        this.signal = traits.signal;
        this.color = color(traits.color);

        this.newNeuronMutationRate = mutationRate.newNeuron;
        this.newSynapseMutationRate = mutationRate.newSynapse;
        this.randomWeightMutationRate = mutationRate.randomWeight;
        this.randomBiasMutationRate = mutationRate.randomBias;
        this.randomThresholdMutationRate = mutationRate.randomThreshold;  

        this.vehicles = [];
        this.champions = []; // Stores the individuals with highest fitnessScore, a.k.a. champions.
        this.idGenerator = 0;

        this.matingPool = [];
        this.genePool =  new GenePool(traits.sensorTypes);       
    }
     
    // Population.populate generates this.size new individuals, each with a new genome and neural circuit.
    populate() {
        for (var i = 0; i < this.size; i++) {  
            
            // initialize vehicle
            let v = new Vehicle(random(canvasWidth), random(canvasHeight), this);
            v.genome = new Genome();
            
            // iniatilize genome
            v.genome.initializeGenes(this.genePool);
            v.connectNeuralCircuit();
            
            if (config.randomizeNC) {
                v.brain.randomize();
            } else {
                v.brain.build(this.brains);
            }
            
            this.addVehicle(v);
        }
    }

    // Population.addVehicle receives a Vehicle object and adds it to current array of vehicles.
    addVehicle(itm) {
      itm.id = ++this.idGenerator;
      this.vehicles.push(itm);
    }

    // sortByFitnessScore sorts this.vehicles array in a descendent fashion considering their fitnessScores.
    sortVehiclesByFitnessScore() {
        this.vehicles.sort(function(a,b){return b.fitnessScore - a.fitnessScore});
    }

    // selection fills the matingPool array for selection based on probability (wheel of fortune).
    selection() {
        this.champions = [];
        this.matingPool = []; // matingPool will have length 100
        this.sortVehiclesByFitnessScore(); // Order vehicles in decreasing order of fitnessScore.

        // find total of all fitness scores
        let total = 0;
        for (let i = 0; i < this.size; i++) {
            total += this.vehicles[i].fitnessScore;
        }
        
        // Select champions to copy
        for (let i = 0; i < config.numberCopied; i++) {
            this.champions.push(this.vehicles[i]);
        }

        // Create mating pool so that a vehicle's probability of mating is equivalent to its fitness score
        // divided by the total fitness score of the population
        for (let i = 0; i < this.size; i++) {
            // add vehicles[i] to mating pool a number of times proportionate to its fitness score.
            let nTimes = Math.round(this.vehicles[i].fitnessScore / total * 100);
            for (let j = 0; j < nTimes; j++) {
                this.matingPool.push(this.vehicles[i]);
            }
        }
    }
    
    // reproduction generates a next generation on individuals using the mating pool from current generation. 
    reproduction() {

        // Destroy previous generation
        this.killThemAll();

        // Copy the the champions from previous generation. 
        for (let i = 0; i < config.numberCopied; i++) {
            var champ = this.champions[i];
            champ.fitnessScore = 0;
            champ.color = [230, 0, 230];
            this.addVehicle(this.champions[i]);
        }

        // Create the rest of individuals by selecting parents from the mating pool
        for (let i = config.numberCopied; i < this.size; i++) {
            
            // randomly select two parents from the mating pool
            var parent1 = random(this.matingPool);
            var parent2 = null;
            var child;
            do {
                parent2 = random(this.matingPool);
                
            } while(parent1.id === parent2.id);

            // Obtain a child object with genome product of parents's genome crossover.
            child = Vehicle.crossover(parent1, parent2);

            // add new child to population
            this.addVehicle(child);
        }

        // rebalance neural circuits to account for new layers
        for (let v of this.vehicles) {
            v.balanceNC();
        }
    }

    // killOne receives an Vehicle object and removes it from current array of vehicles.
    killOne(itm) {
        for (let i = this.vehicles.length - 1; i >= 0; i--) {
            if (this.vehicles[i].id === itm.id) {
                this.vehicles.splice(i, 1);
            }
        }
    }

    // killThemAll sets the current vehicles array as empty.
    killThemAll() {
        this.vehicles = [];
    }
    
    // update function is called on each frame and updates each object's properties.
    // If enough time has passed, it creates a new generation of vehicles.
    update() {
        if (newGeneration) {
            this.selection();
            this.reproduction();
        }
        for (let itm of this.vehicles) {
            itm.update();
        }
    }

    // render function is called on each frame and redraws each vehicle of this population on canvas.
    render() {
        for (let itm of this.vehicles) {
            itm.render();
        } 
    }
}