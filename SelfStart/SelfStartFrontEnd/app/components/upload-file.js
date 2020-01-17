import Component from '@ember/component';
import Ember from "ember";
import fileObject from "../utils/file-object";

export default Component.extend({
  DS: Ember.inject.service('store'),
  model: null,
  flag: null,
  accept: 'audio/*,video/*,image/*',
  multiple: true,
  queue: [],
  savingInProgress: false,

  labelArray: [
    'height: 6.25em',
    'line-height: 5.25em',
    'text-align: center',
  ],

  inputStyle: Ember.computed(function () {
    let style_array = [
      'opacity: 0',
      'width:100% !important',
      'overflow:hidden',
      'position:relative',
      'left:-100%',
      'display:block',
    ];
    return Ember.String.htmlSafe(style_array.join(';'));
  }),

  labelStyle: Ember.computed('labelArray', function () {
    return Ember.String.htmlSafe(this.get('labelArray').join(';'));
  }),


  dragLeave: function (event) {
    event.preventDefault();
    this.set('labelArray', [
      'height: 6.25em',
      'line-height: 5.25em',
      'text-align: center',
    ]);
    return this.set('dragClass', 'deactivated');
  },

  dragOver: function () {
    this.set('labelArray', [
      'height: 6.25em',
      'line-height: 5.25em',
      'text-align: center',
      'background: green',
    ]);
  },

  drop: function () {
    this.set('labelArray', [
      'height: 6.25em',
      'line-height: 5.25em',
      'text-align: center',
    ]);
  },

  actions: {
    selectFile: function (data) {
      if (!Ember.isEmpty(data.target.files)) {
        for (let i = data.target.files.length - 1; i >= 0; i--) {
          let file = fileObject.create({
            fileToUpload: data.target.files[i],
            maximumFileSize: this.get('maximumFileSize')
          });
          this.get('queue').pushObject(file);
        }
      }
    }
    ,
    deleteFile: function (file) {
      this.get('queue').removeObject(file);
      if (Ember.isEmpty(this.get('queue'))) {
        this.set('flag', false);
      }
    }
    ,

    deleteAllFiles: function () {
      this.get('queue').clear();
      this.set('flag', false);
    }
    ,



    saveFile: function (file) {
      console.log(this.get('queue'));
      var newFile = this.get('DS').createRecord(this.get('model'), {
        name: file.name,
        size: file.size,
        type: file.type,
        rawSize: file.rawSize,
        imageData: file.base64Image
      });
      newFile.save().then(() => {
        this.get('queue').removeObject(file);

        if (Ember.isEmpty(this.get('queue'))) {
          this.set('flag', false);
        }
      });

    }
    ,

    saveAllFiles: function () {
      this.set('savingInProgress', true);
      let counter = 0;
      this.get('queue').forEach(file => {
        if (file.isDisplayableImage) {
          var newFile = this.get('DS').createRecord(this.get('model'), {
            name: file.name,
            size: file.size,
            type: file.type,
            rawSize: file.rawSize,
            imageData: file.base64Image
          });
          newFile.save().then(() => {
            counter++;
            if (this.get('queue').length == counter) {
              this.get('queue').clear();
              this.set('flag', false);
              this.set('savingInProgress', false);
            }
          });
        } else{
          counter++;
        }
      });




    }
    ,
    done: function () {
      this.get('queue').clear();
      this.set('flag', false);
    }
  }
});
