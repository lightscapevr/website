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
        current_tab: ''
      }},
    methods:{
      toggle_details_tabs:function(){
         if(this.current_tab == 'cloud-file-details'){this.current_tab = ''}
         else{this.current_tab = 'cloud-file-details'}},
         send_file_to_vr:function(){console.log("TODO: send file to vr")},
         on_change_tab:function(tab_name){this.current_tab = tab_name},
         on_save_edit:function(changed_values){
          console.log("TODO: do save of name and description ("+changed_values.name+")("+changed_values.description+")");
          // TODO update server version, not just local state
          this.file.name = changed_values.name;
          this.file.description = changed_values.description;
          this.current_tab = 'cloud-file-details'},
         on_delete_file:function(){
          console.log("TODO: delete file")
          // TODO send delete request to server
          this.$root.remove_file_by_id(this.file.id);
          this.current_tab = 'cloud-file-details'},
         on_share:function(){
          console.log("TODO: copy link to clipboard")
          this.current_tab = 'cloud-file-details'}
    },
    template: '#cloud-file'
  })

  Vue.component('cloud-file-details', {
    template: '#cloud-file-details'
  })

  Vue.component('cloud-file-edit', {
    props:['file_name','file_description'],
    data: function () {
      return {
        new_name: '',
        new_description:''
      }},
    mounted: function(){this.new_name=this.file_name;this.new_description=this.file_description},
    template: '#cloud-file-edit'
  })

  Vue.component('cloud-file-delete', {
    template: '#cloud-file-delete'
  })

  Vue.component('cloud-file-share', {
    props:['sharable_link'],
    template: '#cloud-file-share'
  })

  // Vue instance
  var app = new Vue({
    el: '#cloud-app',
    data: {
        files: [
          { id: '1', name: 'z', description:'some text',date_modified:'2018.12.25',sharable_link:'link' },
          { id: '2', name: 'y', description:'some text',date_modified:'2018.12.25',sharable_link:'link' },
          { id: '3', name: 'x', description:'some text',date_modified:'2018.12.25',sharable_link:'link' },
          { id: '4', name: 'w', description:'some text',date_modified:'2018.12.25',sharable_link:'link' },
        ]
      },
    methods:{
      remove_file_by_id:function(id){
        var file = this.files.filter(function(f){return f.id === id});
        var index = this.files.indexOf(file[0]);
        if (index !== -1){this.files.splice(index, 1);} 
      }
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