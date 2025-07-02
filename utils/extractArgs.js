module.exports = (interaction) => {
	var args = [];
	for (let option of interaction.options.data) {
		if (option.type === 'SUB_COMMAND') {
			option.options?.forEach((x) => {
				if (x.value) args.push(x.value);
			});
		} else if (option.value) args.push(option.value);
	};
	return args
}