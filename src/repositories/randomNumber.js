"use strict";
exports.__esModule = true;
exports.randomNumber = void 0;
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
}
exports.randomNumber = randomNumber;
