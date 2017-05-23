
var TimeTicker = (function () {

    var timeInterval = "";

    var timeTickerModel = {
        ticks: 100,
        viewMode: 'MI'
    }

    function setupTimeTicker(obj) {
        timeTickerModel.ticks = obj.ticks || 0;
        timeTickerModel.viewMode = obj.viewMode || 'MI';
        startTimeTicker();
    }

    function startTimeTicker() {
        timeInterval = setInterval(tickTime, 100);
    }

    function stopTimeTicker() {
        clearInterval(timeInterval);
    }

    function tickTime() {
        console.log(timeTickerModel.ticks);
        if (timeTickerModel.ticks > 0) {
            timeTickerModel.ticks = timeTickerModel.ticks - 1;
        }
        else {
            stopTimeTicker();
        }
        displayTicks();
    }

    function displayTicks() {
        var days = null, hours = null, minutes = null, seconds = null;

        if (timeTickerModel.viewMode == "SS") {
            seconds = Math.floor((timeTickerModel.ticks / (1)));
        }
        else if (timeTickerModel.viewMode == "MM") {
            minutes = Math.floor((timeTickerModel.ticks / (60)) % (60));
            seconds = Math.floor((timeTickerModel.ticks / (1)) % (60));
        }
        else if (timeTickerModel.viewMode == "HH") {
            hours = Math.floor((timeTickerModel.ticks / (60 * 60)));
            minutes = Math.floor((timeTickerModel.ticks / (60)) % (60));
            seconds = Math.floor((timeTickerModel.ticks / (1)) % (60));
        }
        else {
            days = Math.floor((timeTickerModel.ticks / (60 * 60 * 24)));
            hours = Math.floor((timeTickerModel.ticks / (60 * 60)) % (24));
            minutes = Math.floor((timeTickerModel.ticks / (60)) % (60));
            seconds = Math.floor((timeTickerModel.ticks / (1)) % (60));
        }

        if (timeTickerModel.viewMode == "MX") {
            $("#tickTime").html(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
        }
        if (timeTickerModel.viewMode == "MI") {
            var temp = '';
            temp = temp + ((days == 0) ? '' : (days + "d "));
            temp = temp + ((hours == 0) ? '' : (hours + "h "));
            temp = temp + ((minutes == 0) ? '' : (minutes + "m "));
            temp = temp + ((seconds == null) ? '' : (seconds + "s "));
            $("#tickTime").html(temp);
        }
        else {
            var temp = '';
            temp = temp + ((days == null) ? '' : (days + "d "));
            temp = temp + ((hours == null) ? '' : (hours + "h "));
            temp = temp + ((minutes == null) ? '' : (minutes + "m "));
            temp = temp + ((seconds == null) ? '' : (seconds + "s "));
            $("#tickTime").html(temp);
        }

    }

    return {
        init: setupTimeTicker,
        start: startTimeTicker,
        stop: stopTimeTicker
    }


})();
  
