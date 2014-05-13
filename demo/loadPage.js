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
						"url": "http://cnn.com"
					},
					"execute": "actions/loadPage"
				},
				{
					"execute": "actions/getPageTitle"
				},
				{
					"execute": "actions/log"
				}
			]
		}
	}
});

o.run();