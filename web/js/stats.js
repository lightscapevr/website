
if (window.location.host == 'test.vrsketch.eu') {
    CLIENT_TOKEN_ID = '1076106158582-2hr4jav5kbn2gccs0jsdbdhr4sg1d399.apps.googleusercontent.com';
} else {
    CLIENT_TOKEN_ID = '1076106158582-vekr6opr52b6i8eeu3cc8si7828hisgj.apps.googleusercontent.com';
}

function show_error(err) {
    console.log(err);
}

function convert_date(d)
{
    for (var i = 0; i < d.length; i++) {
        d[i].week = new Date(d[i].week * 1000);
    }
}

function plot(r, target, title) {
    convert_date(r.stats);
    MG.data_graphic({
        title: title,
        data: r.stats,
        x_accessor: 'week',
        y_accessor: 'value',
        target: target,
        interpolate: d3.curveLinear,
        right: 40,
        width: 800,
        height: 400
    });
}

function sum_stats(r1, r2)
{
    var res = [];
    for (var i = 0; i < r1.length; i++) {
        res[i] = {'week' : r1[i].week, 'value': r1[i].value + r2[i].value};
    }
    return res;
}

function plot2(r, target, title) {
    convert_date(r.stats_users);
    convert_date(r.stats_trials)
    MG.data_graphic({
        title: title,
        data: [r.stats_users, r.stats_trials, sum_stats(r.stats_users, r.stats_trials)],
        x_accessor: 'week',
        y_accessor: 'value',
        legend: ['Users', 'Trials', 'Totals'],
        area: [false, false, true],
        target: target,
        interpolate: d3.curveLinear,
        right: 40,
        width: 800,
        height: 400
    });
}

$(document).ready(function () {
    if (window.location.hostname == 'api.vrsketch.eu') {
        window.location = 'https://vrsketch.eu/checkout/';
        return;
    }
    var wsuri;
    if (document.location.origin == "file://") {
        wsuri = "ws://127.0.0.1:8080/ws";

    } else {
        wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
                 document.location.host + "/ws";
    }
    connection = new autobahn.Connection({
      url: wsuri,
      realm: "vrsketch",
      max_retries: -1,
      max_retry_delay: 3,
    });
    connection.onopen = function(session, dets) {
        gapi.load('auth2', function() {
            var auth2 = gapi.auth2.init({'client-id': CLIENT_TOKEN_ID}).then(function () {
                token = auth2.currentUser.get().getAuthResponse().id_token;
                connection.session.call('com.stats.trials', [token]).then(
                    function (r) { plot(r, "#trial-stats", "trial activations (weekly)"); }, show_error
                );
                connection.session.call('com.stats.use-total', [token]).then(
                    function (r) { plot2(r, "#use-stats", "total number of days used (weekly)"); }, show_error
                );
                connection.session.call('com.stats.use-unique', [token]).then(
                    function (r) { plot2(r, "#use-unique", "unique users (weekly)"); }, show_error
                );
                connection.session.call('com.stats.use-unique-monthly', [token]).then(
                    function (r) { plot2(r, "#use-unique-monthly", "unique users (rolling 30 day window)"); }, show_error
                );
            });
        });
//        connection.session.call('com.get_stats', ['oknk2efweo', 'use-count']).then(plot_trial2, show_error);
//        connection.session.call('com.get_stats', ['oknk2efweo', 'use-unique']).then(plot_trial3, show_error);
    };
    connection.open();
});