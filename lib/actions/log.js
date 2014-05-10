module.exports = function (o, chain, value, config) {	
	console.log(value);
	
	chain.next(o, chain, value);
};