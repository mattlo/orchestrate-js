module.exports = function (o, chain, value, config) {	
	console.log(value);
	
	return chain.next(o, chain, value);
};