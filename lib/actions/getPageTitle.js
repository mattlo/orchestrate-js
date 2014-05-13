module.exports = function (o, chain, value, config) {	
	o.eval(function () {
		return document.title;
	}).then(function (value) {
		chain.next(o, chain, value);
	});
};