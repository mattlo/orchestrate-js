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
 * @param {Object} params
 * @param {Callback} callback
 * @returns {undefined}
 */
Chain.prototype.add = function (params, callback) {
	this.steps.push({
		params: params,
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
Chain.executeStepAt = function (stepIndex, o, chain, value) {
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
	
	// set pointer
	this.currentIndex = stepIndex;
	
	// invoke method
	this.steps[stepIndex](o, chain, value);
};

// chain factory
module.exports = function (o, branchConfig) {
	return new Chain(o, branchConfig);
};