function resetChildRepeaters(chain, limit) {
	return chain.internals.repeater.map(function (value, index) {
		if (index < limit) {
			value.currentIndex = 0;
		}
		
		return value;
	});
}

/**
 * 
 * @TODO FLATTEN STACK, THIS LEADS TO VERY LONG STACK TRACES
 * 
 * @param {type} o
 * @param {type} chain
 * @param {type} value
 * @returns {undefined}
 */
function addEndChainSubscriber (o, chain, value) {
	// only one event is needed for the entire chain
	if (chain.internals.repeaterSubscribed !== true) {
		// set up an event listener that determines if this should be executed or not
		o.eventBus().on('chain-end', function () {
			var chainComplete,
				currentRepeater = null,
				repeaterIndex = null,
				resetChildren = false;
				
			// iterate over repeaters, check if repeaters need to be concluded or not, and determine if
			// children repeaters need to be reset
			chainComplete = chain.internals.repeater.every(function (repeater, index) {
				if (repeater.currentIndex + 1 <= repeater.array.length) {
					repeaterIndex = index;
					
					resetChildren = true;
					
					// end repeater check
					return false;
				} else {
					// move onto next one
					return true;
				}
			});
			
			// reset children
			if (resetChildren === true) {
				// reset children
				chain.internals.repeater = resetChildRepeaters(chain, repeaterIndex);
			}
			
			// focus on next chain
			if (chainComplete === false) {
				currentRepeater = chain.internals.repeater[repeaterIndex];
				
				++currentRepeater.currentIndex;
				
				chain.executeStepAt(
					currentRepeater.repeaterStepIndex + 1, 
					o, 
					chain, 
					currentRepeater.array[++currentRepeater.currentIndex]
				);
			}
		});
		
		chain.internals.repeaterSubscribed = true;
	}
}

module.exports = function (o, chain, value, config) {	
	// @TODO have error message for repeaters without subsequent actions

	// value must be an array
	if (value instanceof Array === false) {
		throw new Error('`value` must be an Array on a repeater step');
	}
	
	// track repeaters, the first one is always the inner most repeater
	chain.internals.repeater = chain.internals.repeater || [];
	
	// add chain configs
	chain.internals.repeater.unshift({
		currentIndex: 0,
		repeaterStepIndex: chain.currentIndex,
		array: value
	});
	
	// adds event listener for subscribers on the same chain
	addEndChainSubscriber(o, chain, value);
		
	// proceed onto next event with new value
	chain.next(o, chain, value[0]);
};