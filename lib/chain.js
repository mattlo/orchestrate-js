/**
 * @constructor
 * @param {o} o Orchestrate object
 * @param {Object} branchConfig
 * @returns {Chain}
 */
function Chain (o, branchConfig) {
	this.steps = [];
	this.branchConfig = branchConfig;
	this.o = o;
	this.currentIndex = -1;
};

/**
 * Registers a new step
 * @param {Object} config
 * @param {Callback} callback
 * @returns {undefined}
 */
Chain.prototype.addStep = function (config, callback) {
	this.steps.push({
		config: config,
		callback: callback
	});
};

/**
 * Executes next step
 * @param {o} o Orechstrate object
 * @param {Chain} chain
 * @param {mixed} value
 * @returns {mixed}
 */
Chain.prototype.next = function (o, chain, value) {
	var nextIndex = this.currentIndex + 1;
	
	// check if next index exists
	if (nextIndex < this.steps.length) {
		return this.executeStepAt(nextIndex, o, chain, value);
	}
};

/**
 * Executes step
 * @param {Number} stepIndex
 * @param {o} o Orechstrate object
 * @param {Chain} chain
 * @param {mixed} value
 * @returns {undefined}
 */
Chain.prototype.executeStepAt = function (stepIndex, o, chain, value) {
	// validate step exists
	if (typeof this.steps[stepIndex] === undefined) {
		throw new Error('stepIndex: ' + stepIndex + ' does not exist on chain');
	}
	
	// rebind o if its undefined
	if (o === undefined) {
		o = this.o;
	}
	
	// bind "this" chain if its undefined
	if (chain === undefined) {
		chain = this;
	}
	
	// if there's a default value config, apply it
	if (value === undefined && this.steps[stepIndex].config.defaultValue !== undefined) {
		value = this.steps[stepIndex].config.defaultValue;
	}
	
	// set pointer
	this.currentIndex = stepIndex;
	
	// invoke method (with config)
	this.steps[stepIndex].callback(o, chain, value, this.steps[stepIndex].config);
};

// chain factory
module.exports = function (o, branchConfig) {
	return new Chain(o, branchConfig);
};