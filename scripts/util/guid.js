/**
 * Sample a random hexidecimal character.
 */
function randomHexCharacter() {
    var characters = "0123456789abcdef";
    return characters[Math.floor(Math.random() * 16)];
}

/**
 * Sample a random hexidecimal string of a specific length.
 * @param {int} length 
 */
function randomHexString(length) {
    var randomString = "";
    for (var i = 0; i < length; i++) {
        randomString += randomHexCharacter();
    }
    return randomString;
}

/**
 * Sample a random GUID, whose weakness is because it does
 * not use external factors to increase the probability of
 * uniqueness.
 */
function getWeakGuid() {
    var randomStrings = [
        randomHexString(8),
        randomHexString(4),
        randomHexString(4),
        randomHexString(4),
        randomHexString(12)
    ];
    return randomStrings.join("-");
}
