function show_error(err) {
  vueAppApi.show_error(err);
}

function format_size(s)
{
  if (s > 1024 * 1024)
    return (s / 1024 / 1024).toFixed(1).toString() + "M";
  else if (s > 1024)
    return (s / 1024).toFixed(0).toString() + "k";
  else
    return s.toString();
}

function format_localtime(tstamp)
{
  let FORMAT = "DD MMMM YYYY hh:ss";
  return moment(new Date(tstamp * 1000)).format(FORMAT);
}

var vueAppApi = {};
(function (public_api) {
  'use strict';

  Vue.component('upload-file', {
    // A way to upload sketchup files to the cloud
    methods: {
      upload_files_on_change: function (event) {
        var file_upload = new FileUpload("/checkout/files/new", {}, function(ev) {
          var percentage = Math.floor((ev.loaded / ev.total) * 100);
          notify('Uploading (' + percentage + '%) ...', undefined, 0);
        });
        var files = event.target.files || event.dataTransfer.files;
        if (!files.length)
          return;
        let notify = this.$root.show_notification_for_time;
        Array.prototype.forEach.call(files, function (file) {
          file_upload.upload(file, {}, function (r) {
            if (!r.success) {
              show_error(r.error);
            } else {
              connection.session.call('com.files.add', [app.token, file.name,
                r.fname]).then(public_api.list_files, show_error);
            }
            notify('Done uploading ' + file.name);
            //connection.session.call('com.files.add', [app.token, ])
           }, function() {
            notify('Uploading error', 'alert-danger')
          });
          notify('Uploading ' + file.name + ' ...', undefined, 0);
        });
      }
    },
    template: '#upload-file'
  })



  Vue.component('cloud-file-list', {
    // List of all the files the user has uploaded
    props: ['files'],
    data: function () {
      return {
        order: '',
        selected_file: ''
      }
    },
    methods: {
      set_selected_file: function (file) { this.selected_file = file; },
      order_by_name: function () {
        if (this.order != 'name') {
          this.files.sort(utils.sort_by_name);
          this.order = 'name';
        }
        else {
          this.files.reverse();
        }
      },
      order_by_date: function () {
        if (this.order != 'date') {
          this.files.sort(utils.sort_by_date);
          this.order = 'date';
        }
        else {
          this.files.reverse();
        }
      },
      order_by_size: function () {
        if (this.order != 'size') {
          this.files.sort(utils.sort_by_size);
          this.order = 'size';
        }
        else {
          this.files.reverse();
        }
      }
    },
    template: '#cloud-file-list'
  })



  Vue.component('cloud-file', {
    // The individual file information
    props: ['file'],
    data: function () {
      return {
        current_tab: ''
      }
    },
    computed: {
      is_selected: function () {
        var is_sel = this.$parent.selected_file == this.file;
        if (!is_sel)
          this.current_tab = '';
        return is_sel;
      }
    },
    methods: {
      toggle_details_tabs: function () { (this.current_tab == 'cloud-file-details' || this.current_tab == 'cloud-file-sharing')
           ? this.hide_details() : this.show_details(); },
      toggle_sharing_tab: function() { this.current_tab == 'cloud-file-sharing' ? this.hide_sharing() : this.show_sharing(); },
      hide_details: function () { this.current_tab = ''; this.$parent.set_selected_file(''); },
      show_details: function () { this.current_tab = 'cloud-file-details'; this.$parent.set_selected_file(this.file); },
      hide_sharing: function () { this.current_tab = ''; this.$parent.set_selected_file(''); },
      show_sharing: function () { this.current_tab = 'cloud-file-sharing'; this.$parent.set_selected_file(this.file); },
      on_change_tab: function (tab_name) { this.current_tab = tab_name },
      on_save_edit: function (changed_values) {
        console.log("TODO: do save of name and description (" + changed_values.name + ")(" + changed_values.description + ")");
        // TODO check that the input is valid
        this.file.name = changed_values.name;
        this.file.description = changed_values.description;
        this.$root.show_notification_for_time('Changes saved (XXX not implemented)');
        // TODO update server version, not just local state
        this.current_tab = 'cloud-file-details'
      },
      on_download_file: function () {
        console.log("TODO: Download file:" + this.file.name);
        this.$root.show_notification_for_time('Downloading ' + this.file.name + ' (XXX not implemented)');
        this.toggle_details_tabs();
        // TODO download file
      },
      on_delete_file: function () {
        let root = this.$root;
        let current_file = this.file;
        connection.session.call('com.files.delete', [app.token, this.file.id]).then(
          function (r) {
            if (r) {
              root.remove_file_by_id(current_file);
              root.show_notification_for_time('File deleted');
            } else {
              root.show_notification_for_time('File delete failed', 'alert-danger');
            }
          }, function () {
            root.show_notification_for_time('File delete failed', 'alert-danger');
          });
        this.current_tab = 'cloud-file-details'
      },
      on_share: function () {
        var input_name = 'share-link-' + this.file.id;
        document.getElementById(input_name).select();
        var copy_result = document.execCommand('copy');
        if (copy_result) {
          this.$root.show_notification_for_time('Link copied to your clipboard');
        } else {
          this.$root.show_notification_for_time('Could not copy link');
        }
      }
    },
    template: '#cloud-file'
  })



  Vue.component('cloud-file-details', {
    // Tab providing all the options the the user can do to the file
    template: '#cloud-file-details'
  })

  Vue.component('cloud-file-edit', {
    // Tab to rename and change the description
    props: ['file_name', 'file_description'],
    data: function () {
      return {
        new_name: '',
        new_description: ''
      }
    },
    mounted: function () { this.new_name = this.file_name; this.new_description = this.file_description },
    template: '#cloud-file-edit'
  })



  Vue.component('cloud-file-delete', {
    // Tab to confirm the deletion of a file
    template: '#cloud-file-delete'
  })



  Vue.component('cloud-file-sharing', {
    // Tab to share the file
    props: ['sharable_link', 'id'],
    template: '#cloud-file-sharing'
  })



  Vue.component('notification-bar', {
    // Area to display messages to the user
    props: ['notification', 'close'],
    template: '#notification-bar'
  })



  // -------------------------------------- Vue instance -------------------------------------- 
  var app = new Vue({
    el: '#cloud-app',
    data: {
      files: [],
      logged_in: false,
      connection_status: 'Not connected',
      notification: { show: false, message: '', type: 'alert-info', timer: {} }
    },
    methods: {
      remove_file_by_id: function (file) {
        var index = this.files.indexOf(file);
        if (index !== -1) { this.files.splice(index, 1); }
      },
      show_notification_for_time: function (message, type, timeout) {
        this.notification.show = true;
        this.notification.message = message.toString();
        if (type == undefined)
          this.notification.type = 'alert-info';
        else
          this.notification.type = type;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        if (timeout == undefined) {
          this.timer = setTimeout(this.hide_notification, 4000);
        } else if (timeout != 0) {
          this.timer = setTimeout(this.hide_notification, timeout);
        } else {
          this.timer = null;
        }
      },
      hide_notification: function () { this.notification.show = false; this.notification.message = ''; this.notification.type = 'alert-info'; }
    }
  })



  // -------------------------------------- public api function -------------------------------------- 

  public_api.set_connection_status = function (status) {
    app.show_notification_for_time('Connection status: ' + status);
    app.connection_status = status;
  }

  public_api.insert_file_data = function (files) { app.files = files; }
  // File data schema
  // id, name, description, date_modified, size,sharable_link

  public_api.show_notification = function (message, type) { app.show_notification_for_time(message, type); };

  public_api.show_error = function (error) { app.show_notification_for_time(error, 'alert-danger'); };

  public_api.list_files = function () {
    connection.session.call('com.files.list', [app.token]).then(function (r) {
      if (!r.success) {
        show_error(r.error);
      } else {
        // format results
        for (var i = 0; i < r.result.length; i++)
        {
          let elem = r.result[i];
          elem.date_modified = format_localtime(elem.date_modified);
          elem.size = format_size(elem.size);
        }
        app.files = r.result;
      }
    }, show_error);
  };

  public_api.log_in = function (name, token)
  {
    app.logged_in = true;
    app.token = token;
    /* This should probably be done differently, but I'm avoiding the mess for now */
    $("#login-button").text(name);
    $("#login-button").addClass("dropdown-toggle");
    $("#login-button").attr("data-toggle", "dropdown");
    public_api.list_files();
  };

  public_api.logout = function () 
  {
    app.logged_in = false;
    app.token = null;
    app.files = [];
    $("#login-button").text("Log in");
    $("#login-button").removeClass("dropdown-toggle");
    $("#login-button").attr("data-toggle", null);
    $("#login-dropdown").hide();
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.attachClickHandler($("#login-button")[0], {ux_mode: 'redirect'},
                             on_sign_in, show_error);
    auth2.signOut();
  }

  public_api.log_in_license_key = function (license_key)
  {
    connection.session.call('com.user.')
    app.logged_in = true;
    app.license_key = license_key;
    public_api.list_files();
  };



  // -------------------------------------- Helper functions -------------------------------------- 
  var utils = {
    sort_by_name: function (a, b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    },
    sort_by_date: function (a, b) {
      if (a.date_modified < b.date_modified)
        return -1;
      if (a.date_modified > b.date_modified)
        return 1;
      return 0;
    },
    sort_by_size: function (a, b) {
      if (a.size < b.size)
        return -1;
      if (a.size > b.size)
        return 1;
      return 0;
    }
  }
})(vueAppApi);

connection = null;

function on_sign_in(cu)
{
  vueAppApi.log_in(cu.getBasicProfile().getName(), cu.getAuthResponse().id_token);
  $("#login-button").replaceWith($("#login-button").clone()); // remove event listeners
}

$(document).ready(function () {
  wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
           document.location.host + "/ws";
  connection = new autobahn.Connection({
    url: wsuri,
    realm: "vrsketch",
    max_retries: -1,
    max_retry_delay: 3,
  });
  connection.onopen = function(session, dets) {
    if (window.location.hash.startsWith('#P')) {
      /* don't log in with google, but instead use the value of the
         hash-tag as license key */
      let license_id = window.location.hash.substring(2, 2+64);
      window.location.hash = '';
      connection.session.call('com.user.get_basic_info', [license_id]).then(
        function (res) {
          if (!res.success) {
            show_error(res.error);
            return;
          }
          vueAppApi.log_in(res.name, license_id);
        }, show_error);
      // load the gapi anyway, but don't do anything with it
      gapi.load('auth2', function() {
        let auth2 = gapi.auth2.init({'client_id': GOOGLE_CLIENT_TOKEN_ID});
      });
      return;
    }
    gapi.load('auth2', function() {
      let auth2 = gapi.auth2.init({'client_id': GOOGLE_CLIENT_TOKEN_ID});
      auth2.then(function () {
        if (auth2.isSignedIn.get()) {
          on_sign_in(auth2.currentUser.get());
        } else {
          // attach the google log in button to login button
          auth2.attachClickHandler($("#login-button")[0], {ux_mode: 'redirect'},
                                   on_sign_in, show_error);
        }
      });
    });

    /* autoping functionality not implemented */
    function ping_server() {
      connection.session.call('com.ping', []);
      setTimeout(ping_server, 10000);
    }

    ping_server();

  };
  connection.open();
});

