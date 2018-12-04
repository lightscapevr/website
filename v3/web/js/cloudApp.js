(function () {
  'use strict';

  // Store
  var store = {
    state: {
      files: []
    },
    fetch_all_files: function () {
      // TODO : get real data from server on startup
      this.state.files = [
        { name: 'file z', id: '1' },
        { name: 'file y', id: '2' },
        { name: 'file x', id: '3' },
        { name: 'file w', id: '4' },
      ]
    }
  }

  // Components
  Vue.component('cloud-file-list', {
    props: ['files'],
    methods: {
      order_by_name: function () { this.files.sort(utils.compare_by_name) },
      order_by_id: function () { this.files.sort(utils.compare_by_id) },
    },
    template: '<div><button v-on:click="order_by_name">Sort by name</button><button v-on:click="order_by_id">Sort by id</button>' +
      '<ul><li v-for="file in files"><cloud-file :key="file.id" v-bind:file="file"></cloud-file></li></ul></div>'
  })

  Vue.component('cloud-file', {
    props: ['file'],
    template: '<div><p>{{file.name}}</p><p>Cloud file id = {{file.id}}</p><hr></div>'
  })

  // Vue instance
  var app = new Vue({
    el: '#cloud-app',
    data: store.state,
    mounted: function () { store.fetch_all_files() }
  })

  // Helper functions
  var utils = {
    compare_by_name: function (a, b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    },
    compare_by_id: function (a, b) {
      if (a.id < b.id)
        return -1;
      if (a.id > b.id)
        return 1;
      return 0;
    }
  }


})();