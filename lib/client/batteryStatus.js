var _self,
    db = ripple('db'),
    constants = ripple('constants');


function getInitialState() {
    return {
        level: db.retrieve(constants.BATTERY_STATUS.BATTERY_STATUS_KEY) || 100,
        isPlugged: db.retrieve(constants.BATTERY_STATUS.IS_PLUGGED_KEY) || false
    };
}

function setState(state) {
    if (state) {
        db.save(constants.BATTERY_STATUS.BATTERY_STATUS_KEY, state.level);
        db.save(constants.BATTERY_STATUS.IS_PLUGGED_KEY, state.isPlugged);
    }
    _fireBatteryEvent(state);
}

function _fireBatteryEvent(state) {
    var win = ripple('emulatorBridge').window();

    if (win && win.cordova) {
        // Do nothing if we aren't emulating a valid Cordova application
        win.cordova.fireWindowEvent("batterystatus", state);

        var level = parseInt(state.level);
        if (level === 20 || level === 5) {
            if (level === 20) {
                win.cordova.fireWindowEvent("batterylow", state);
            } else {
                win.cordova.fireWindowEvent("batterycritical", state);
            }
        }
    }
}


_self = {
    getInitialState: getInitialState,
    setState: setState
};

module.exports = _self;
