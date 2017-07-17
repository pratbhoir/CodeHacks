
var TimeTicker = (function () {

    var timeInterval = "";

    var timeTickerModel = {
        ticks: 100,
        notifyBefore: 0,
        viewMode: 'MI',
        displayClass: 'clsSessionTimeout',
        onComplete: function () { },
        onNotify: function () { }
    }

    function setupTimeTicker(obj) {
        timeTickerModel.ticks = obj.ticks || 0;
        timeTickerModel.notifyBefore = obj.notifyBefore || 0;
        timeTickerModel.viewMode = obj.viewMode || 'MI';
        timeTickerModel.displayClass = obj.displayClass || 'clsSessionTimeout';
        timeTickerModel.displayClass = '.' + timeTickerModel.displayClass;
        timeTickerModel.onComplete = obj.onComplete || function () { };
        timeTickerModel.onNotify = obj.onNotify || function () { };
        displayTicks();
        startTimeTicker();
    }

    function startTimeTicker() {
        clearInterval(timeInterval);
        timeInterval = setInterval(tickTime, 1000);
    }

    function stopTimeTicker() {
        clearInterval(timeInterval);
    }

    function tickTime() {
        if (timeTickerModel.ticks > 0) {
            timeTickerModel.ticks = timeTickerModel.ticks - 1;
            if (timeTickerModel.ticks == timeTickerModel.notifyBefore) {
                timeTickerModel.onNotify();
            }
        }
        else {
            stopTimeTicker();
            timeTickerModel.onComplete();
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
            var temp = '';
            temp = pad(days, 2) + "d " + pad(hours, 2) + "h " + pad(minutes, 2) + "m " + pad(seconds, 2) + "s ";
            $(timeTickerModel.displayClass).html(temp);
            //            document.getElementById("tickTimeDisplay").innerHTML = temp;
        }
        if (timeTickerModel.viewMode == "MI") {
            var temp = '';
            temp = temp + ((days == 0) ? '' : (pad(days, 2) + "d "));
            temp = temp + ((hours == 0) ? '' : (pad(hours, 2) + "h "));
            temp = temp + ((minutes == 0) ? '' : (pad(minutes, 2) + "m "));
            temp = temp + ((seconds == null) ? '' : (pad(seconds, 2) + "s "));
            $(timeTickerModel.displayClass).html(temp);
            //            document.getElementById("tickTimeDisplay").innerHTML = temp;
        }
        else {
            var temp = '';
            temp = temp + ((days == null) ? '' : (pad(days, 2) + "d "));
            temp = temp + ((hours == null) ? '' : (pad(hours, 2) + "h "));
            temp = temp + ((minutes == null) ? '' : (pad(minutes, 2) + "m "));
            temp = temp + ((seconds == null) ? '' : (pad(seconds, 2) + "s "));
            $(timeTickerModel.displayClass).html(temp);
            //            document.getElementById("tickTimeDisplay").innerHTML = temp;
        }

    }

    function pad(value, digit) {
        var strPad = '000000';
        if (value.toString().length > digit) {
            return value;
        }
        else {
            var temp = strPad + value;
            return temp.substr(temp.length - digit, digit);
        }
    }

    return {
        init: setupTimeTicker,
        start: startTimeTicker,
        stop: stopTimeTicker
    }


})();


function ShowSessionTimeoutWarning() {
    ShowConfirmDialog("Time left for session to expire: <span class='clsSessionTimeout'></span> <br><br> Click Confirm to continue your session.", "Session Expiration Warning");
    $("#btnConfirmProceed").off("click").on("click", function () {
        $.get(AppModel.SessionResetURL);
        CloseConfirmDialog();
    });
}

function ShowSessionTimeoutComplete() {
    //alert("Session Completed");
    ShowMsg("Your session is expired. <br><br>To Login again, please <a href='" + AppModel.LoginPageURL + "'>Click Here</a>", "Session Timeout");
    CloseConfirmDialog();

}

function resetSessionTimer() {
    var sessionTimeout = 10 * 60;
    var sessionTimeoutNotify = 9 * 60;
    TimeTicker.init({ ticks: sessionTimeout, notifyBefore: sessionTimeoutNotify, viewMode: 'MM', onComplete: ShowSessionTimeoutComplete, onNotify: ShowSessionTimeoutWarning });
}


$(document).ajaxComplete(function () {
    resetSessionTimer();
});

$(document).ready(function () {
    resetSessionTimer();
});
