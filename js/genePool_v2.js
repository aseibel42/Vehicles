// genePool_v2.js
// Written by primarily by Carlos Venegas
// Last updated on 12/13/18

class GenePool {
    
    constructor(signalTypes) {
      this.synapseGenes = []; // edges determine the trait to be inherited
      this.layers = [[], []]; // array of array of neuronGenes. Initialized with two empty arrays.
      this.geneCount = 0;
      this.initializePool(signalTypes);
    }
  
    // initializePool receives an array of signalTypes and creates 2 input neuron genes (sensors) for each 
    // signal, and 2 output neuron genes (effectors). It generates the synapses for connecting sensors with effectors 
    // and adds them all to the current GenePool.
    initializePool(signalTypes) {
      // create 2 input neurons for each type of signal (sensors)
      for (let i = 0; i < signalTypes.length * 2; i++) {
        let ng = new NeuronGene(0, NODETYPE.INPUT);
        this.addNeuronGene(ng);  
      }
  
      // create 2 output neurons (effectors)
      let o1 = new NeuronGene(1, NODETYPE.OUTPUT);
      let o2 = new NeuronGene(1, NODETYPE.OUTPUT);
      this.addNeuronGene(o1);
      this.addNeuronGene(o2);
  
      // connect all inputs with all outputs
      for (let i = 0; i < this.layers[0].length; i++) {
        let s1 = new SynapseGene(this.layers[0][i], o1, true);
        let s2 = new SynapseGene(this.layers[0][i], o2, true);
        this.addSynapseGene(s1);
        this.addSynapseGene(s2);
      }
    }
  
    // addNeuronGene receives a NeuronGene object and adds it to the respective layer in the GenePool.
    addNeuronGene(ng) {
      // autoincrement: unique id
      ng.id = ++this.geneCount;
      this.layers[ng.layer].push(ng);
    }
  
    addSynapseGene(sg) {
      // autoincrement: unique id
      sg.id = ++this.geneCount;
      this.synapseGenes.push(sg);
    }
  
    // addLayer function takes an index and inserts a new layer at index position of the layers array.
    // It also updates the layer numbering for all nodes whose layer is > newLayerIndex
    addLayer(index) {
      this.layers.splice(index, 0, []);
      
      // update layer attribute of all NeuronGenes in any layer > index
      for (let i = index + 1; i < this.layers.length; i++) {
        for (let j = 0; j < this.layers[i].length; j++) {
          this.layers[i][j].layer++;
        }
      }
    }

    // getSynapseGene looks for a synapse (ng1, ng2) in current gene pool and returns it. 
    getSynapseGene(ng1, ng2) {
      for (let i = 0; i < this.synapseGenes.length; i++) {
        if (this.synapseGenes[i].from.id === ng1.id && this.synapseGenes[i].to.id === ng2.id) {
          return this.synapseGenes[i];
        }
      }
      return null;
    }

  }

  // NeuronGene class definition
// a neuron gene object stores information used for creating a neuron object
    // contructor receives the layer number for the neuron to be added and its type (HIDDEN, INPUT, or OUTPUT).
class NeuronGene {
  
  constructor(layer, type) {
    this.id = 0;
    this.layer = layer;
    this.type = type;
  }

  // copy returns a copy of current object.
  copy() {
    return this;
  }
}

// SynapseGene class definition
// a synapse gene object stores information used for creating a synapse object
    // from: incoming NeuronGene object
    // to: outgoing NeuronGene object
    // enabled: initial state of the object. True by default.
class SynapseGene {
  
  constructor(from, to, enabled = true) {
    this.id = 0;
    this.from = from;
    this.to = to;
    this.enabled = enabled;
  }

  // length calculates the number of layers this synapse crosses.
  get length() {
    return this.to.layer - this.from.layer;
  }
 
  // copy returns a copy of the current object.
  copy() { 
    return this;
  }

  // disable sets the enabled property of the object as false.
  disable() {
    this.enabled = false;
  }
  
}