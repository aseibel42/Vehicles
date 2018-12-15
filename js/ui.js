// ui.js
// Last modified on 12/13/18

var resetButton;
var moduleSelect;
var randomizeNCCheckbox;
var simulationSpeedSlider;
var drawNCCheckbox;
var drawFieldsCheckbox;
var noiseSlider;
var signalRadiusSlider;
var signalIntensitySlider;
var massSlider;
var motorSpeedSlider;
var motorFrictionSlider;
var motorFrontBackPlacementSlider;
var motorSeparationSlider;
var sensorFrontBackPlacementSlider;
var sensorSeparationSlider;
var populationSizeSlider;
var generationLifespanSelect;
var mutationRateSelect;
var numberCopiedSlider;

// UISetup grabs elements from the document and sets up the event listener functions
// for an interactive UI
function UISetup() {

// select HTML elements
resetButton = document.getElementById("resetBtn");
moduleSelect = document.getElementById("module");
randomizeNCCheckbox = document.getElementById("randomizeNC");
populationSizeSlider = document.getElementById("populationSize");
numberCopiedSlider = document.getElementById("numberCopied");
generationLifespanSelect = document.getElementById("genLifespan");
mutationRateSelect = document.getElementById("mutationRate");
drawNCCheckbox = document.getElementById("showNC");
drawFieldsCheckbox = document.getElementById("showFields");
simulationSpeedSlider = document.getElementById("simSpeed");
noiseSlider = document.getElementById("envNoise");
signalRadiusSlider = document.getElementById("signalRadius");
signalIntensitySlider = document.getElementById("signalIntensity");
massSlider = document.getElementById("mass");
motorSpeedSlider = document.getElementById("motorSpeed");
motorFrictionSlider = document.getElementById("friction");
motorFrontBackPlacementSlider = document.getElementById("motorFBPlacement");
motorSeparationSlider = document.getElementById("motorSeparation");
sensorFrontBackPlacementSlider = document.getElementById("sensorFBPlacement");
sensorSeparationSlider = document.getElementById("sensorSeparation");

// Set default values
randomizeNCCheckbox.checked = config.randomizeNC;
drawNCCheckbox.checked = config.renderNeuralCircuit;
populationSizeSlider.value = config.populationSize.toString();
numberCopiedSlider.value = config.numberCopied.toString();
simulationSpeedSlider.value = config.simulationSpeed.toString();
noiseSlider.value = config.environmentNoise.toString();
signalRadiusSlider.value = config.signalRadius.toString();
signalIntensitySlider.value = config.signalIntensity.toString();
massSlider.value = config.massScale.toString();
motorSpeedSlider.value = config.motorSpeed.toString();
motorFrictionSlider.value = config.motorFriction.toString();
motorFrontBackPlacementSlider.value = config.motorFrontBackPlacement.toString();
motorSeparationSlider.value = config.motorSeparation.toString();
sensorFrontBackPlacementSlider.value = config.sensorFrontBackPlacement.toString();
sensorSeparationSlider.value = config.sensorSeparation.toString();

// setup event listener functions
resetButton.addEventListener("click", Reset);
moduleSelect.addEventListener("change", UpdateModule);
randomizeNCCheckbox.addEventListener("click", ToggleRandomizeNC);
populationSizeSlider.addEventListener("change", UpdatePopulationSize);
numberCopiedSlider.addEventListener("change", UpdateNumCopied);
generationLifespanSelect.addEventListener("change", UpdateGenerationLifespan);
mutationRateSelect.addEventListener("change", UpdateMutationRate);
drawNCCheckbox.addEventListener("click", ToggleDrawNC);
drawFieldsCheckbox.addEventListener("click", ToggleDrawFields);
simulationSpeedSlider.addEventListener("change", UpdateSimSpeed);
noiseSlider.addEventListener("change", UpdateEnvNoise);
signalRadiusSlider.addEventListener("change", UpdateSignalRadius);
signalIntensitySlider.addEventListener("change", UpdateSignalIntensity);
massSlider.addEventListener("change", UpdateMass);
motorSpeedSlider.addEventListener("change", UpdateMotorSpeed);
motorFrictionSlider.addEventListener("change", UpdateMotorFriction);
motorFrontBackPlacementSlider.addEventListener("change", UpdateMotorFBPlacement);
motorSeparationSlider.addEventListener("change", UpdateMotorSeparation);
sensorFrontBackPlacementSlider.addEventListener("change", UpdateSensorFBPlacement);
sensorSeparationSlider.addEventListener("change", UpdateSensorSeparation);
}

// Reset overwrites the Environment object and initializes a new world based on the current settings.
// This function is called whenever the user changes modules.
function Reset() {
  world = new Environment();
  runModule(config.simModule);
  generationTimer = 0;
  loop();
}

// Pause or resume the simulation
function pauseSimulation(el) {
  paused = !paused;
  if (paused) {
    noLoop();
    // change text and icon
    el.childNodes[2].textContent = "play";
    el.childNodes[1].textContent = "play_arrow";
  } else {
    loop();
    // change text and icon
    el.childNodes[2].textContent = "pause";
    el.childNodes[1].textContent = "pause";
  }
}

// Event handler functions for updating every config value:
function UpdateModule() {
  config.simModule = getModule(moduleSelect.value);
  Reset();
}

function ToggleRandomizeNC() {
  config.randomizeNC = randomizeNCCheckbox.checked;
}

function UpdateSimSpeed() {
  config.simulationSpeed = Number(simulationSpeedSlider.value);
  deltaT = config.simulationSpeed / config.fps;
}

function ToggleDrawNC() {
  config.renderNeuralCircuit = drawNCCheckbox.checked;
}

function ToggleDrawFields() {
  config.renderFields = drawFieldsCheckbox.checked;
}

function UpdateEnvNoise() {
  config.environmentNoise = Number(noiseSlider.value);
}

function UpdateSignalRadius() {
  config.signalRadius = Number(signalRadiusSlider.value);
}

function UpdateSignalIntensity() {
  config.signalIntensity = Number(signalIntensitySlider.value);
}

function UpdateMass() {
  config.massScale = Number(massSlider.value);
}

function UpdateMotorSpeed() {
  config.motorSpeed = Number(motorSpeedSlider.value);
}

function UpdateMotorFriction() {
  config.motorFriction = Number(motorFrictionSlider.value);
}

function UpdateMotorFBPlacement() {
  config.motorFrontBackPlacement = Number(motorFrontBackPlacementSlider.value);
}

function UpdateMotorSeparation() {
  config.motorSeparation = Number(motorSeparationSlider.value);
}

function UpdateSensorFBPlacement() {
  config.sensorFrontBackPlacement = Number(sensorFrontBackPlacementSlider.value);
}

function UpdateSensorSeparation() {
  config.sensorSeparation = Number(sensorSeparationSlider.value);
}

function UpdatePopulationSize() {
  config.populationSize = Number(populationSizeSlider.value);
}

function UpdateNumCopied() {
  config.numberCopied = Number(numberCopiedSlider.value);
}

function UpdateMutationRate() {
  config.mutationRate = getMutationRate(mutationRateSelect.value);
}

function UpdateGenerationLifespan() {
  generationTimer = 0;
  if (generationLifespanSelect.value == "Inf") {
    config.generationLifespan = Infinity;
  } else {
    config.generationLifespan = Number(generationLifespanSelect.value);
  }
}

// getModule receives a string and returns the module object of the same name.
function getModule(modString) {
  var module;
  switch(modString) {
    case "TRAFFIC_MODULE":
      module = TRAFFIC_MODULE;
      break;
    case "FOOD_FINDER_MODULE":
      module = FOOD_FINDER_MODULE;
      break;
    case "PREDATOR_PREY_MODULE":
      module = PREDATOR_PREY_MODULE;
      break;
    // case "EXPLORATION_MODULE":
    //   module = EXPLORATION_MODULE;
    //   break;
    case "CLUSTER_MODULE":
      module = CLUSTER_MODULE; 
      break;
    default:
      module = null;
  }
  return module;
}

// getMutationRate receives a string and returns the corresponding mutation rate object of the same name.
function getMutationRate(mrString) {
  var mr;
  switch(mrString) {
    case "DISABLED":
      mr = DISABLED;
      break;
    case "SLOW":
      mr = SLOW;
      break;
    case "MEDIUM":
      mr = MEDIUM;
      break;
    case "FAST":
      mr = FAST;
      break;
    default:
      mr = null;
  }
  return mr;
}