
window.buses = null;
window.currentBus = null;

var init = function() {
    initBuses();

    var busList = document.getElementById("bus-list");

    for (var index in window.buses) {
        var bus = window.buses[index];
        var hoursArray = hoursStringToArray(bus.hours);
        var nextBuses = getNextBuses(hoursArray);
        var busDiv = document.createElement('div');
        busDiv.innerHTML = '\
            <div class="place-bus">\
                <div class="title">'+ bus.title +'</div>\
                <div class="minutes-to-next">'+ nextBuses.minutesToNextBus +'<span> min</span></div>\
                <div class="next-hours">'+ nextBuses.nextThreeBuses +'<span onclick="edit('+ index +')">...</span></div>\
            </div>';
        busList.appendChild(busDiv.children[0]);
    }

    //setInterval(refresh, 30 * 1000);
}

var initBuses = function() {
    var data = window.localStorage["buses"];
    if (data) {
        window.buses = JSON.parse(data);
    } else {
        window.buses = [{title:"HB Terminal Boqueirão", hours:"05:15, 05:45, 05:55, 06:03, 06:13, 06:22, 06:31, 06:41, 06:50, 06:59, 07:09, 07:18, 07:27, 07:37, 07:46, 07:55, 08:05, 08:14, 08:23, 08:33, 08:42, 08:51, 09:19, 09:47, 10:15, 10:43, 11:11, 11:39, 11:53, 12:07, 12:21, 12:35, 12:49, 13:03, 13:17, 13:31, 13:45, 13:59, 14:27, 14:55, 15:23, 15:52, 16:21, 16:49, 17:01, 17:13, 17:25, 17:37, 17:49, 18:01, 18:13, 18:25, 18:37, 18:49, 19:01, 19:13, 19:25, 19:37, 19:49, 20:14, 20:39, 21:04, 21:29, 21:54, 22:22, 22:50, 23:10, 23:30, 23:50"}];
    }
}

var add = function() {
    hideDeleteBtn();
    showBusForm();

    window.currentBus = null;
    document.getElementById('bus-title').value = '';
    document.getElementById('bus-hours').value = '';
}

var edit = function(busIndex) {
    showDeleteBtn();
    showBusForm();

    window.currentBus = busIndex;
    document.getElementById('bus-title').value = window.buses[busIndex].title;
    document.getElementById('bus-hours').value = window.buses[busIndex].hours;
}

var del = function() {
    if (confirm("Uma vez que deletar estará deletado para sempre!")) {
        window.buses.splice(window.currentBus, 1);
        saveOnLocalStorage();
        refresh();
    }
}

var save = function() {
    var title = document.getElementById('bus-title').value;
    var hours = document.getElementById('bus-hours').value;

    if (window.currentBus !== null) {
        window.buses[window.currentBus].title = title;
        window.buses[window.currentBus].hours = hours;
    } else {
        var newBus = {};
        newBus.title = title;
        newBus.hours = hours;

        window.buses.push(newBus);
    }

    saveOnLocalStorage();
    refresh();
}

var saveOnLocalStorage = function() {
    window.localStorage["buses"] = JSON.stringify(window.buses);
}

var hideDeleteBtn = function() {
    document.getElementById('delete').classList.add('hidden');
}

var showDeleteBtn = function() {
    document.getElementById('delete').classList.remove('hidden');
}

var showBusForm = function() {
    document.getElementById('bus-list').classList.add('hidden');
    document.getElementById('bus-form').classList.remove('hidden');
}

var hoursStringToArray = function(hoursStr) {
    var hoursWithNoSpace = hoursStr.replace(/ /g, '');
    var hoursArray = hoursWithNoSpace.split(",");
    return hoursArray;
}

var getNextBuses = function(hours) {
    var now = new Date();
    var thisHour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
    var thisMinute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    var thisHourAndMinutes = thisHour + ":" + thisMinute + "X";
    hours.push(thisHourAndMinutes);
    hours.sort();
    var nowIdx = hours.indexOf(thisHourAndMinutes);
    var nextHourAndMinutes = hours[nowIdx + 1] ? hours[nowIdx + 1].split(":") : hours[0];
    var hourNextBus = parseInt(nextHourAndMinutes[0]);
    var minutesNextBus = parseInt(nextHourAndMinutes[1]);
    var nextBusDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourNextBus, minutesNextBus, 0, 0);
    var diff = Math.abs(nextBusDate - now);
    var minutes = Math.floor((diff/1000)/60);

    return {
        minutesToNextBus: minutes,
        nextThreeBuses: getNextTreeBuses(hours, nowIdx)
    }
}

var getNextTreeBuses = function(hours, nowIdx) {
    var nextBusesStr = "";
    var aux = 0;

    for (var i = nowIdx; i < nowIdx + 3; i++) {
        if (hours[i+1]) {
            nextBusesStr = nextBusesStr ? nextBusesStr + ", " + hours[i+1] : hours[i+1];
        } else {
            nextBusesStr = nextBusesStr ? nextBusesStr + ", " + hours[aux] : hours[aux];
            aux++;
        }
    }

    return nextBusesStr;
}

var refresh = function() {
    window.location = "";
}

init();