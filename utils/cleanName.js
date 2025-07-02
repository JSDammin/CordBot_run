const truncated = require('./truncated')

module.exports = (name) => {
    // Use a regular expression to test for non-alphanumeric characters, allowing - and _
    const regex = /^[a-zA-Z0-9-_]+$/;
    const pass = regex.test(name);
    if (!pass) return

    return truncated(name, 10, false).toLowerCase()
}