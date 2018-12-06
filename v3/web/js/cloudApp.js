var vueAppApi = {};
(function (public_api) {
  'use strict';

  // -------------------------------------- Components -------------------------------------- 
  Vue.component('active-file', {
    // Indicates which file is currently being synced and provides info about that file.
    props: ['file'],
    methods: {
      remove_active_file: function () {
        this.$root.remove_active_file();
        this.$root.show_notification_for_time('File deactivated');
      }
    },
    template: '#active-file'
  })

  Vue.component('cloud-file-list', {
    // List of all the files the user has uploaded
    props: ['files'],
    methods: {
      order_by_name: function () { this.files.sort(utils.compare_by_name) },
      order_by_name_rev: function () { this.files.sort(utils.compare_by_name).reverse() }
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
    methods: {
      toggle_details_tabs: function () {
        if (this.current_tab == 'cloud-file-details') { this.current_tab = '' }
        else { this.current_tab = 'cloud-file-details' }
      },
      send_file_to_vr: function () {
        console.log("TODO: send file to vr");
        this.$root.show_notification_for_time(this.file.name + ' sent to VR');
        this.$root.set_active_file(this.file);
      },
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
          this.$root.show_notification_for_time('Like copied to your clipboard');
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
      active_file: false,
      user_name: 'Not logged in',
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
      show_notification_for_time: function (message, type) {
        this.notification.show = true;
        this.notification.message = message;
        if (type == undefined)
          this.notification.type = 'alert-info';
        else
          this.notification.type = type;
        clearTimeout(this.timer);
        this.timer = setTimeout(this.hide_notification, 4000);
      },
      hide_notification: function () { this.notification.show = false; this.notification.message = ''; this.notification.type = 'alert-info'; }
    }
  })

  // -------------------------------------- public api function -------------------------------------- 
  public_api.set_user_name = function (name) {
    app.user_name = name;
  }
  public_api.set_connection_status = function (status) {
    app.show_notification_for_time('Connection status: ' + status);
    app.connection_status = status;
  }
  public_api.insert_file_list = function (files) { app.files = files; }
  public_api.show_notification = function (message, type) { app.show_notification_for_time(message, type); }

  // -------------------------------------- Helper functions -------------------------------------- 
  var utils = {
    compare_by_name: function (a, b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }
  }
})(vueAppApi);

// Populate with test data.
setTimeout(function () { vueAppApi.set_user_name('Tim') }, 200);
setTimeout(function () { vueAppApi.set_connection_status('Connected') }, 500);
var temp_file_data = [
  { id: '1', name: 'My house.skp', description: 'some text', date_modified: '2018.12.25', sharable_link: 'linkAAAA' },
  { id: '2', name: 'Homework-final.skp', description: 'some text', date_modified: '2018.12.25', sharable_link: 'linkBBBB' },
  { id: '3', name: 'a cool model.skp', description: 'some text', date_modified: '2018.12.25', sharable_link: 'linkCCCC' },
  { id: '4', name: 'xyz.skp', description: 'some text', date_modified: '2018.12.25', sharable_link: 'linkDDDD' },
]
setTimeout(function () { vueAppApi.insert_file_list(temp_file_data) }, 800);