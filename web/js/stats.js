
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

function get_stats_by_user_id()
{
    var id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
    var customer_id = $("#customer_id").val();
    connection.session.call('com.stats.use_by_customer_id', [id_token, customer_id]).then(function (r) {
        if (!r.success) {
            $("#results").html("No results");
            return;
        } else {
            var html = "<div class='row'><div class='col-4'>Date:</div><div class='col-4'>Number of days:</div><div class='col-4'>Version:</div></div>";
            for (var i = 0; i < r.stats.length; i++) {
                var s = r.stats[i];
                var d = formatDate(s[0]);
                var count = s[1];
                var version = s[2];
                html += ("<div class='row'><div class='col-4'>" + d + "</div><div class='col-4'>" + 
                   count + " days</div><div class='col-4'>" + version + "</div></div>");
            }
            $("#results").html(html);
        }
    })
}

function open_stats() {
    var login_cookie = parse_cookie().vrsketch_login_token;
    if (login_cookie) {
        let token = login_cookie;
        connection.session.call('com.stats.trials', [token]).then(
            function (r) { plot(r, "#trial-stats", "trial activations (weekly)"); }, show_error
        );
        connection.session.call('com.stats.use-total', [token]).then(
            function (r) { plot2(r, "#use-stats", "total number of days used (rolling weekly)"); }, show_error
        );
        connection.session.call('com.stats.use-unique', [token]).then(
            function (r) { plot2(r, "#use-unique", "unique users (rolling weekly)"); }, show_error
        );
        connection.session.call('com.stats.use-unique-monthly', [token]).then(
            function (r) { plot2(r, "#use-unique-monthly", "unique users (rolling 30 day window)"); }, show_error
        );
        connection.session.call('com.user.check', [login_cookie]).then(function (r) {
            on_cookie_sign_in(r.fullname, r.email, login_cookie);
        });
    } else {
        $("#main-header").text("You are not authorized to see this.");
    }
//        connection.session.call('com.get_stats', ['oknk2efweo', 'use-count']).then(plot_trial2, show_error);
//        connection.session.call('com.get_stats', ['oknk2efweo', 'use-unique']).then(plot_trial3, show_error);
}
