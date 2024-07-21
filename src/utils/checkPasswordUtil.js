'use strict';

function isPasswordValid(password) {
    const minLength = 8;
    const hasNumber = /\d/; 
    const hasUpperCase = /[A-Z]/;

    if (password.length < minLength) return false;
    if (!hasNumber.test(password)) return false;
    if (!hasUpperCase.test(password)) return false;

    return true;
}

module.exports = isPasswordValid;