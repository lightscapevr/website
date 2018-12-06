(function () {
  'use strict';


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
    data: function () {
      return {
        current_tab: '',
        tabs:['cloud-file-details','cloud-file-edit','cloud-file-delete','cloud-file-share']
      }},
    methods:{
      toggle_details_tabs:function(){
         if(this.current_tab == 'cloud-file-details'){this.current_tab = ''}
         else{this.current_tab = 'cloud-file-details'}},
         send_file_to_vr:function(){console.log("TODO, send file to vr")},
         on_change_tab:function(tab_name){this.current_tab = tab_name}
    },
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
        ]
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