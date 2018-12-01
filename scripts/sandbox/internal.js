window.onload = function() {
    window.addEventListener("message", processMessage, false);
}

/**
 * Get the parameter name being used.
 */
function getParameterName() {
    return document.getElementById("parameterName").innerText;
}

/**
 * Set the parameter name to be used.
 * @param {string} newName
 */
function setParameterName(newName) {
    document.getElementById("parameterName").innerText = newName;
}

/**
 * Get the function body being used.
 */
function getFunctionBody() {
    return document.getElementById("functionBody").innerText;
}

/**
 * Set the function body to be used.
 * @param {string} newBody 
 */
function setFunctionBody(newBody) {
    document.getElementById("functionBody").innerText = newBody;
}

/**
 * Compute the result of applying this object's transfer
 * function to a JavaScript object.
 * @param {object} datum 
 */
function computeResult(datum) {
    return new Function(getParameterName(), getFunctionBody())(datum);
}

/**
 * Process a message, determining what to do, and sending a result.
 * @param {object} message 
 */
function processMessage(message) {
    if (message.data.compute === true) {
        message.source.postMessage(computeResult(message.data.datum),
            message.origin);
    } else {
        setParameterName(message.data.par);
        setFunctionBody(message.data.body);
    }
}
