exports.dateName = function () {
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    var today = new Date();

    var day = today.toLocaleTimeString("en-UK", options);
    return day;


}

exports.dayName = function () {
    var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    var today = new Date();

    var day = today.toLocaleDateString("en-UK", options);
    return day;


}