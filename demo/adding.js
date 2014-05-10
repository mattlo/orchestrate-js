var o = require('../lib/orchestrate.js');

// made up step!
var addOneStep = function (o, chain, value) {	
	value = parseInt(value, 10) + 1;
	
	chain.next(o, chain, value);
};

o.importConfig({
	"options": {
		"startOnBranch": "helloWorld"
	},
	"branches": {
		"helloWorld": {
			"options": {},
			"steps": [
				{
					"options": {
						"defaultValue": "1"
					},
					"execute": addOneStep
				},
				{
					"execute": "function (o, chain, value) {value = parseInt(value, 10) + 1; return chain.next(o, chain, value);}"
				},
				{
					"execute": "actions/log"
				}
			]
		}
	}
});

o.run();