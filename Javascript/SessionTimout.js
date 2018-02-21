
var SessionTimeoutTimeTicker = (function () {

    var timeInterval = "";

    var timeTickerModel = {
        totalTicks: 100,
        ticks: 100,
        notifyBefore: 0,
        viewMode: 'MI',
        displayClass: 'clsSessionTimeout',
        onComplete: function () { },
        onNotify: function () { }
    }

    function setupTimeTicker(obj) {
        timeTickerModel.totalTicks = obj.ticks || 0;
        timeTickerModel.ticks = obj.ticks || 0;
        timeTickerModel.notifyBefore = obj.notifyBefore || 0;
        timeTickerModel.viewMode = obj.viewMode || 'MI';
        timeTickerModel.displayClass = obj.displayClass || 'clsSessionTimeout';
        timeTickerModel.displayClass = '.' + timeTickerModel.displayClass;
        timeTickerModel.onComplete = obj.onComplete || function () { };
        timeTickerModel.onNotify = obj.onNotify || function () { };
        displayTicks();
        localStorage.SessionTimeoutResetTime = new Date();
        startTimeTicker();
    }

    function startTimeTicker() {
        clearInterval(timeInterval);
        timeInterval = setInterval(tickTime, 1000);
    }

    function stopTimeTicker() {
        clearInterval(timeInterval);
    }

    function resetTimeTicker() {
        clearInterval(timeInterval);
        timeTickerModel.ticks = timeTickerModel.totalTicks;
        timeInterval = setInterval(tickTime, 1000);
    }

    function tickTime() {
        // If session is resetted within 1 sec the reset the session
        if ((Math.abs(new Date(localStorage.SessionTimeoutResetTime) - new Date()) / 1000) < 2) {
            //resetTimeTicker();
            timeTickerModel.ticks = timeTickerModel.totalTicks;
            return;
        }
        if (timeTickerModel.ticks > 0) {
            timeTickerModel.ticks = timeTickerModel.ticks - 1;
            if (timeTickerModel.ticks > timeTickerModel.notifyBefore) {
                //Close Notify
//                CloseConfirmDialog();
//                CloseShowMsg();
            }
            if (timeTickerModel.ticks == timeTickerModel.notifyBefore) {
                timeTickerModel.onNotify();
            }
            if (timeTickerModel.ticks == 0) {
                timeTickerModel.onComplete();
            }
        }
        else {
            //stopTimeTicker();
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
        stop: stopTimeTicker,
        reset: resetTimeTicker
    }


})();


function ShowSessionTimeoutWarning() {
    ShowConfirmDialog("Time left for session to expire: <b><span class='clsSessionTimeout'></span></b><br> Click Confirm to continue your session.", "Session Expiration Warning");
    $("#btnConfirmProceed").off("click").on("click", function () {
        $.get(AppModel.SessionResetURL, function (data) {
            CloseConfirmDialog();
            //ShowMsg(data.responseMessage,"Session Reset");
        });
    });
}

function ShowSessionTimeoutComplete() {
    //alert("Session Completed");
    //    ShowMsg("Your session is expired. <br><br>To Login again, please <a href='" + AppModel.LoginPageURL + "'>Click Here</a>", "Session Timeout");
    //    CloseConfirmDialog();
    window.location.href = "/Home/SessionTimeout";

}

function resetSessionTimer() { 
    var sessionTimeout = 30 * 60;
    var sessionTimeoutNotify = 5 * 60;
//        var sessionTimeout = 10;
//        var sessionTimeoutNotify = 5;
    SessionTimeoutTimeTicker.init({ ticks: sessionTimeout, displayClass: 'clsSessionTimeout', notifyBefore: sessionTimeoutNotify, viewMode: 'MM', onComplete: ShowSessionTimeoutComplete, onNotify: ShowSessionTimeoutWarning });
}

//Resseting session while ajax complete
$(document).ajaxComplete(function () {
    resetSessionTimer();
});

//Resseting session while Refresh complete
$(document).ready(function () {
    resetSessionTimer();
});

