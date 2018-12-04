(function () {
  'use strict';

  // Store
  var store = {
    state: {
      files: [],
      current_file: 'cloud-file'
    },
    fetch_all_files: function () {
      // TODO : get real data from server on startup
      this.state.files = [
        { name: 'z', id: '1' },
        { name: 'y', id: '2' },
        { name: 'x', id: '3' },
        { name: 'w', id: '4' },
      ]
    }
  }

  // Components
  Vue.component('cloud-file-list', {
    props: ['files'],
    methods: {
      order_by_name: function () { this.files.sort(utils.compare_by_name) },
      order_by_name_rev: function () { this.files.sort(utils.compare_by_name).reverse() },
      order_by_id: function () { this.files.sort(utils.compare_by_id) },
    },
    template: '#cloud-file-list'
  })

  Vue.component('cloud-file', {
    props: ['file'],
    template: '#cloud-file'
  })

  Vue.component('tests', {
    template: '#my-test'
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