module.exports = (color) => {
    const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    return hexPattern.test(color);
}