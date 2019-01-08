if (window.location.host == 'test.vrsketch.eu') {
    GOOGLE_CLIENT_TOKEN_ID = '1076106158582-2hr4jav5kbn2gccs0jsdbdhr4sg1d399.apps.googleusercontent.com';
    CHARGEBEE_SITE = 'baroquesoftware-test';
} else if (window.location.host == 'dev.vrsketch.eu') {
    GOOGLE_CLIENT_TOKEN_ID = '1076106158582-vqlj400ho3b2dpeiqd2bvofu20mhsj46.apps.googleusercontent.com';
    CHARGEBEE_SITE = 'baroquesoftware-test';
} else {
    Sentry.init({ dsn: 'https://38c4d64c82484e57b0199aef2d2e83cf@sentry.io/1306011' });
    GOOGLE_CLIENT_TOKEN_ID = '1076106158582-vekr6opr52b6i8eeu3cc8si7828hisgj.apps.googleusercontent.com';
    CHARGEBEE_SITE = 'baroquesoftware';
}
