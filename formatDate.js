  
var d = new Date();
console.log(d);
console.log(formatDate(d));

function formatDate(t) {
    if (new Date(t) != 'Invalid Date') {
        var temp = t.toLocaleDateString().split('/');
        var result = padDigits(temp[0], 2) + '-' + padDigits(temp[1], 2) + '-' + temp[2];
        return result;
    } else {
        console.log("Invalid date");
    }
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}
