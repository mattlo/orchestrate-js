var chain = require('./chain'),
	o = module.exports = {},
	branches = {},
	config;

/**
 * Imports config from file or object
 * @param {Object} obj
 * @returns {undefined}
 */
o.importConfig = function (obj) {
	// @TODO add config integrity check
	var p;
	
	config = obj.options;
	
	// iterate over branch configs
	for (p in obj.branches) {
		// register branch
		this.registerBranch(p, obj.branches[p].options, obj.branches[p].steps);
	}
};

/**
 * Starts running branches
 * @returns {undefined}
 */
o.run = function () {
	// @TODO add default branch config
	
	// run first branch
	var branch;
	
	// get first branch by initializing a loop on an obj
	for (branch in branches) {
		// start branch execution
		branches[branch].executeStepAt(0);
		
		// stop iteration
		break;
	}
};

/**
 * Registers branch
 * @param {String} name
 * @param {Object} branchConfig
 * @param {Array} steps
 * @returns {undefined}
 */
o.registerBranch = function (name, branchConfig, steps) {
	if (branches[name] !== undefined) {
		throw new Error(name + ' branch already exists');
	}
	
	// create new chain
	var branch = branches[name] = chain(this, branchConfig),
		exec;
	
	// register tasks
	steps.forEach(function (step) {
		// identify if execute exists
		if (typeof step.execute === undefined) {
			throw new Error('A step is missing an `execute` definition');
		}
		
		// @TODO validate if its a function block or not
		
		// if built in package
		try {
			exec = require('./' + step.execute);
		} catch (e) {
			// couldn't find system actions, looking for packages..
			// @TODO potentially dangerious for ambiguous names
			try {
				exec = require(step.execute);
			} catch (e) {
				// must be a function, wrap it around params for `Function` value return
				exec = eval('(' + step.execute.toString() +  ')');
			}
		}
		
		branch.addStep(step.options, exec);
	});
};

/**
 * Returns branch
 * @param {String} name
 * @returns {Chain}
 */
o.getBranch = function (name) {
	if (typeof branches[name] === undefined) {
		throw new Error(name + ' branch does not exist');
	}
	
	return branches[name];
};