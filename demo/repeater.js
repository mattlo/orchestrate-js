var o = require('../lib/orchestrate.js');

var list = function (o, chain, value) {	
	chain.next(o, chain, [1,2,3]);
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
					"execute": list
				},
				{
					"execute": "actions/repeater"
				},
				{
					"execute": "actions/log"
				}
			]
		}
	}
});

o.run();