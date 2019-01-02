function show_error(err) {
  vueAppApi.show_error(err);
}

var vueAppApi = {};
(function (public_api) {
  'use strict';


  // -------------------------------------- Components -------------------------------------- 
  // Vue.component('active-file', {
  //   // Indicates which file is currently being synced and provides info about that file.
  //   props: ['file'],
  //   data: function () {
  //     return {
  //       link: 'Paste a shared link here...',
  //     }
  //   },
  //   computed: {
  //     title: function () { return (this.file != false) ? 'File sent to VR' : 'Choose a file to send to VR' }
  //   },
  //   methods: {
  //     remove_active_file: function () {
  //       this.$root.remove_active_file();
  //       this.$root.show_notification_for_time('File de-activated');
  //     },
  //     send_link_to_vr: function () {
  //       console.log("TODO: send link to vr. Link:" + this.link)
  //       this.$root.show_notification_for_time('Loading file from link');
  //     }
  //   },
  //   template: '#active-file'
  // })



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
      is_active: function () { return this.$root.active_file == this.file; },
      is_selected: function () {
        var is_sel = this.$parent.selected_file == this.file;
        if (!is_sel)
          this.current_tab = '';
        return is_sel;
      }
    },
    methods: {
      toggle_details_tabs: function () { (this.current_tab == 'cloud-file-details') ? this.hide_details() : this.show_details(); },
      hide_details: function () { this.current_tab = ''; this.$parent.set_selected_file('') },
      show_details: function () { this.current_tab = 'cloud-file-details'; this.$parent.set_selected_file(this.file) },
      send_file_to_vr: function () {
        console.log("TODO: send file to vr");
        this.$root.show_notification_for_time(this.file.name + ' sent to VR');
        this.$root.set_active_file(this.file);
      },
      show_error: function (err) {
        this.$root.show_notification_for_time(err, 'alert-danger');
      },
      remove_active_file: function () { this.$root.remove_active_file(this.file); },
      on_change_tab: function (tab_name) { this.current_tab = tab_name },
      on_save_edit: function (changed_values) {
        console.log("TODO: do save of name and description (" + changed_values.name + ")(" + changed_values.description + ")");
        // TODO check that the input is valid
        this.file.name = changed_values.name;
        this.file.description = changed_values.description;
        this.$root.show_notification_for_time('Changes saved');
        // TODO update server version, not just local state
        this.current_tab = 'cloud-file-details'
      },
      on_download_file: function () {
        console.log("TODO: Download file:" + this.file.name);
        this.$root.show_notification_for_time('Downloading ' + this.file.name);
        this.toggle_details_tabs();
        // TODO download file
      },
      on_delete_file: function () {
        console.log("TODO: delete file")
        // TODO send delete request to server
        this.$root.remove_file_by_id(this.file);
        this.$root.show_notification_for_time('File deleted');
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
        this.current_tab = 'cloud-file-details'
      }
    },
    template: '#cloud-file'
  })



  Vue.component('cloud-file-details', {
    // Tab providing all the options the the user can do to the file
    template: '#cloud-file-details'
  })

  Vue.component('cloud-file-active', {
    // Tab providing info on the active file (file being sent to VR)
    data: function () {
      return {
        users_in_vr: ['Tim', 'Sally'],
      }
    },
    computed: {
      connection_status: function () { return this.$root.connection_status; }
    },
    methods: {
      // TODO, find way to add, remove and clear users
      add_user: function (user) { this.users_in_vr.push(user) },
      clear_users: function () { this.users_in_vr = [] },
      remove_users: function (user) {
        var index = this.users_in_vr.indexOf(user);
        this.users_in_vr.splice(index, 1);
      }
    },
    template: '#cloud-file-active'
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



  Vue.component('cloud-file-share', {
    // Tab to share the file
    props: ['sharable_link', 'id'],
    template: '#cloud-file-share'
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
      active_file: false,
      connection_status: 'Not connected',
      notification: { show: false, message: '', type: 'alert-info', timer: {} }
    },
    methods: {
      remove_file_by_id: function (file) {
        var index = this.files.indexOf(file);
        if (index !== -1) { this.files.splice(index, 1); }
        if (file == this.active_file) { this.active_file = false; }
      },
      set_active_file: function (file) { this.active_file = file; },
      remove_active_file: function (file) { this.active_file = false; },
      show_notification_for_time: function (message, type, timeout) {
        this.notification.show = true;
        this.notification.message = message;
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

  public_api.show_notification = function (message, type) { app.show_notification_for_time(message, type); }

  public_api.list_files = function () {
    if (app.token)
    {
        var call_name = 'com.files.list';
        var call_arg = app.token;
    }
    else if (app.license_key)
    {
        var call_name = 'com.files.list_license_key';
        var call_arg = app.license_key;
    }
    else
        return;
    connection.session.call(call_name, [call_arg]).then(function (r) {
      if (!r.success) {
        show_error(r.error);
      } else {
        app.files = r.result;
      }
    }, show_error);
  }

  public_api.log_in = function (name, token)
  {
    app.logged_in = true;
    app.token = token;
    /* This should probably be done differently, but I'm avoiding the mess for now */
    $("#login-button").text(name);
    public_api.list_files();
  };

  public_api.log_in_license_key = function (license_key)
  {
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
    if (window.location.hash[0] == 'P') {
      /* don't log in with google, but instead use the value of the
         hash-tag as license key */
      vueAppApi.log_in_license_key(window.location.hash.substring(1));
      return;
    }
    gapi.load('auth2', function() {
      auth2 = gapi.auth2.init({'client_id': GOOGLE_CLIENT_TOKEN_ID});
      auth2.then(function () {
        if (auth2.isSignedIn.get()) {
          let cu = auth2.currentUser.get();
          vueAppApi.log_in(cu.getBasicProfile().getName(), cu.getAuthResponse().id_token);

/*          connection.session.call('com.files.list', [cu]);*/
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

/*

// Populate with test data.
setTimeout(function () { vueAppApi.set_connection_status('Connected') }, 2000);
var temp_file_data = [
  { id: '1', name: 'My house.skp', description: 'some text', date_modified: '2018.12.01', size: 13, sharable_link: 'linkAAAA' },
  { id: '2', name: 'Homework-final.skp', description: 'some text', date_modified: '2018.12.02', size: 152, sharable_link: 'linkBBBB' },
  { id: '3', name: 'a cool model.skp', description: 'some text', date_modified: '2018.12.03', size: 200, sharable_link: 'linkCCCC' },
  { id: '4', name: 'xyz.skp', description: 'some text', date_modified: '2018.12.04', size: 95, sharable_link: 'linkDDDD' },
]

setTimeout(function () { vueAppApi.insert_file_data(temp_file_data) }, 4000);*/
