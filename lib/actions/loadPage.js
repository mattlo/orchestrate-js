module.exports = function (o, chain, value, config) {
	// @TODO add status checks
	o.getMainTab().open(config.url, function(status) {
		chain.next(o, chain);
	});
};