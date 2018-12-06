(function () {
  'use strict';


  // Components
  Vue.component('cloud-file-list', {
    props: ['files','other'],
    methods: {
      order_by_name: function () { this.files.sort(utils.compare_by_name) },
      order_by_name_rev: function () { this.files.sort(utils.compare_by_name).reverse() },
      order_by_id: function () { this.files.sort(utils.compare_by_id) },
    },
    template: '#cloud-file-list'
  })

  Vue.component('cloud-file', {
    props: ['file', 'testd'],
    template: '#cloud-file'
  })

  Vue.component('cloud-file-details', {
    template: '#cloud-file-details'
  })

  Vue.component('cloud-file-edit', {
    template: '#cloud-file-edit'
  })

  Vue.component('cloud-file-delete', {
    template: '#cloud-file-delete'
  })

  Vue.component('cloud-file-share', {
    template: '#cloud-file-share'
  })

  // Vue instance
  var app = new Vue({
    el: '#cloud-app',
    data: {
        files: [
          { name: 'z', id: '1' },
          { name: 'y', id: '2' },
          { name: 'x', id: '3' },
          { name: 'w', id: '4' },
        ],
        tabs: ['cloud-file-details','cloud-file-edit','cloud-file-delete','cloud-file-share'],
        current_tab : 'cloud-file-details'
      }
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