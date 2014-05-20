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
	
	// only one event is needed for the entire chain
	if (chain.internals.repeaterSubscribed !== true) {
		// set up an event listener that determines if this should be executed or not
		o.eventBus().on('chain-end', function () {
			// look for self
			var chainComplete = chain.internals.repeater.every(function (repeater, index) {
				var nextIndex;

				if (repeater.currentIndex + 1 < repeater.array.length) {
					// increment next value
					nextIndex = ++chain.internals.repeater[index].currentIndex;

					// reset chain
					chain.executeStepAt(repeater.repeaterStepIndex + 1, o, chain, repeater.array[nextIndex]);

					// @TODO reset all child repeaters
				} else {
					// move onto next one
					return true;
				}
			});

			console.log('chain complete?');
			console.log(chainComplete);
		});
		
		chain.internals.repeaterSubscribed = true;
	}
		
	// proceed onto next event with new value
	chain.next(o, chain, value[0]);
};