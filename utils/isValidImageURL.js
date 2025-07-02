module.exports = (url) => {
    // Check if the URL starts with http or https
    if (!url.startsWith("http://") && !url.startsWith("https://") || url.length > 1000) {
        return false;
    }

    // Check if the URL ends with a valid image file extension
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
    const hasValidExtension = validImageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    
    return hasValidExtension;
}