module.exports = (category, interaction, duration) => {
	if (duration === 0) { // 
		if (!this.var.cooldowns[category]) return; // Expecting error
		this.var.cooldowns[category][interaction.user.id] = 0;
		return;
	};

	try {
		if (!this.var.cooldowns[category]) this.var.cooldowns[category] = {};
	
		if (this.var.cooldowns[category][interaction.user.id] > Date.now()) { // Cooldown active
			return true; // Return true for on cooldown
		};

		this.var.cooldowns[category][interaction.user.id] = Date.now() + (duration * 1000); // Set new cooldown
		return false; // Return false for not on cooldown

	} catch (err) {
		console.error(Error(`plugins.cooldowns: ${err}`));
		return true; // Return true incase of abuse on command 
	}
};