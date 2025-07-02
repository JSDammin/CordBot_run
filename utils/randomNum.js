module.exports = (min,max) => {
	return Number(Math.floor(Math.random()*(max+1-min) + min));
};