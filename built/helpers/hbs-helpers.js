var hbs = require('express-hbs');
//Work like 
hbs.registerHelper('select', function (selected, options) {
    return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"');
});
// <select>
// {{#select CurrentSort}}
//     <option value="1" > Most Recent First< /option>
//     < option value= "2" > Most Recent Last< /option>
//     < option value= "3" > Highest Score First< /option>
//     < option value= "4" > Highest Score Last< /option>
//     < option value= "5" > Most Comments< /option>
//     < option value= "6" > Fewest Comments< /option>
//     < option value= "7" > Most Helpful Votes< /option>
//     < option value= "8" > Fewest Helpful Votes< /option>
// {{/select}}
// </select>
hbs.registerHelper('compare', function (lvalue, operator, rvalue, options) {
    var operators, result;
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
    }
    operators = {
        '==': function (l, r) { return l == r; },
        '===': function (l, r) { return l === r; },
        '!=': function (l, r) { return l != r; },
        '!==': function (l, r) { return l !== r; },
        '<': function (l, r) { return l < r; },
        '>': function (l, r) { return l > r; },
        '<=': function (l, r) { return l <= r; },
        '>=': function (l, r) { return l >= r; },
        'typeof': function (l, r) { return typeof l == r; }
    };
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    result = operators[operator](lvalue, rvalue);
    if (result) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
});
module.exports = hbs;
