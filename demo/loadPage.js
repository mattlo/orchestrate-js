var o = require('../lib/orchestrate.js');

o.importConfig({
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