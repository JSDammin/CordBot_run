module.exports = (message, maxLength=2000, ellipsis=true) => {
	if (message.length > maxLength) {
        if (ellipsis) return message.substring(0, maxLength - 3) + '...';
        return message.substring(0, maxLength)
    }
    return message;
}