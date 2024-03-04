"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
var envPath = './scripts/.env';
require('dotenv').config({ path: envPath });
var _a = process.env, MAX_COMPLETIONS = _a.MAX_COMPLETIONS, MAX_GAMES = _a.MAX_GAMES, MAX_NOMINATIONS = _a.MAX_NOMINATIONS, MAX_THEMES = _a.MAX_THEMES, MAX_USERS = _a.MAX_USERS;
var idRegex = /VALUES \((\d+)/;
var isIdGreater = function (query, max) {
    if (max === void 0) { max = '0'; }
    var maxNumber = parseInt(max, 10);
    if (idRegex.test(query)) {
        var id = (query.match(idRegex) || ['0', '0'])[1];
        return parseInt(id, 10) > maxNumber;
    }
    return false;
};
var input = './dump.sql';
var output = './output.sql';
var result = (0, node_fs_1.readFileSync)(input, { encoding: 'utf-8' })
    .slice(1)
    .replace(/;\n+/g, ';\n')
    .split(';\n');
var initial = result
    .filter(function (x) { return x && !x.startsWith('INSERT'); });
var streaks = result
    .filter(function (x) { return x && x.startsWith('INSERT INTO [public.streaks'); });
var completions = result
    .filter(function (x) { return x && x.startsWith('INSERT INTO [public.completions'); })
    .filter(function (x) { return isIdGreater(x, MAX_COMPLETIONS); })
    .sort(function (a, b) { return a.localeCompare(b); });
var games = result
    .filter(function (x) { return x && x.startsWith('INSERT INTO [public.games'); })
    .filter(function (x) { return isIdGreater(x, MAX_GAMES); })
    .sort(function (a, b) { return a.localeCompare(b); });
var nominations = result
    .filter(function (x) { return x && x.startsWith('INSERT INTO [public.nominations'); })
    .filter(function (x) { return isIdGreater(x, MAX_NOMINATIONS); })
    .sort(function (a, b) { return a.localeCompare(b); });
var themes = result
    .filter(function (x) { return x && x.startsWith('INSERT INTO [public.themes'); })
    .filter(function (x) { return isIdGreater(x, MAX_THEMES); })
    .sort(function (a, b) { return a.localeCompare(b); });
var users = result
    .filter(function (x) { return x && x.startsWith('INSERT INTO [public.users'); })
    .filter(function (x) { return isIdGreater(x, MAX_USERS); })
    .sort(function (a, b) { return a.localeCompare(b); });
(0, node_fs_1.writeFileSync)(output, __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
    "-- Don't forget to update the gotm winners, if there are new winners."
], initial, true), users, true), games, true), themes, true), nominations, true), completions, true), streaks, true).join(';\n'), { encoding: 'utf-8' });
console.log('Query generated. Please copy and execute the query on the DB to update.');
readline.question('Did it run successfully? Type \'yes\' to confirm.', function (response) {
    if (response.toLocaleLowerCase() === 'yes') {
        console.log('writing new env file.');
        var newMaxMap = new Map();
        newMaxMap.set('MAX_COMPLETIONS', completions.map(function (x) { return (x.match(idRegex) || ['0', '0'])[1]; })
            .map(function (x) { return parseInt(x, 10); })
            .sort().pop() || 0);
        newMaxMap.set('MAX_GAMES', games.map(function (x) { return (x.match(idRegex) || ['0', '0'])[1]; })
            .map(function (x) { return parseInt(x, 10); })
            .sort().pop() || 0);
        newMaxMap.set('MAX_NOMINATIONS', nominations.map(function (x) { return (x.match(idRegex) || ['0', '0'])[1]; })
            .map(function (x) { return parseInt(x, 10); })
            .sort().pop() || 0);
        newMaxMap.set('MAX_THEMES', themes.map(function (x) { return (x.match(idRegex) || ['0', '0'])[1]; })
            .map(function (x) { return parseInt(x, 10); })
            .sort().pop() || 0);
        newMaxMap.set('MAX_USERS', users.map(function (x) { return (x.match(idRegex) || ['0', '0'])[1]; })
            .map(function (x) { return parseInt(x, 10); })
            .sort().pop() || 0);
        console.log('New Max Values:');
        var newEnv_1 = [];
        newMaxMap.forEach(function (value, key) { return newEnv_1.push("".concat(key, "=").concat(value)); });
        (0, node_fs_1.writeFileSync)("".concat(envPath, "-new"), newEnv_1.join('\n'));
        console.log('deleting results file...');
        (0, node_fs_1.rmSync)(output);
    }
    readline.close();
});
