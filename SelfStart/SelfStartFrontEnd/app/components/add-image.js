import Component from '@ember/component';
// import { computed } from '@ember/object';
import { inject } from '@ember/service';
import Ember from 'ember';
import fileObject from "../utils/file-object";

export default Component.extend({
  patientsData:null,
  DS: inject('store'),
  auth: inject('auth'),
  flagAdd: null,
  disabled: null,

  init(){
    this._super(...arguments);
    let self = this;
    let eemail = localStorage.getItem('sas-session-id');
    eemail = this.get('auth').decrypt(eemail);
    console.log(eemail);

    self.get('DS').queryRecord('patient', {filter: {'email' : eemail}}).then(function (temp) {
        self.set('patientsData', temp);
    });
  },


  // ImageName: null,

  model: 'image',
  flag: null,
  accept: 'audio/*,video/*,image/*',
  multiple: true,
  queue: [],
  modelQueue: [],
  savingInProgress: false,
  isEditing: false,
  id: null,

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

  obj: [],

  actionStep: [],

  array: [],

  actions: {
    selectFile: function (data) {
      if (!Ember.isEmpty(data.target.files)) {
        for (let i = data.target.files.length - 1; i >= 0; i--) {
          let file = fileObject.create({
            fileToUpload: data.target.files[i],
            maximumFileSize: 6
          });
          console.log(file);
          this.get('queue').pushObject(file);
        }
      }
    },

    deleteFile: function (file) {
      this.get('queue').removeObject(file);
      if (Ember.isEmpty(this.get('queue'))) {
        this.set('flag', false);
      }
    },

    done: function () {
      this.get('queue').clear();
      this.set('flag', false);
    },

    addActionStep(){
      let newActStep = this.get('ActionSteps');
      this.get('actionStep').pushObject(newActStep);
      this.set('ActionSteps', "");
    },

    addObjective(){
      let newObj = this.get('Objective');
      this.get('obj').pushObject(newObj);
      this.set('Objective', "");
    },

    cancel() {
      this.set('isEditing', false);
    },


    submit: function() {
      let secQueue = [];

      this.queue.forEach(file => {
        secQueue.pushObject(file);
      });

      secQueue.forEach(file => {
        var self = this;
        var newFile = this.get('DS').createRecord(this.get('model'), {
          name: file.name,
          size: file.size,
          type: file.type,
          rawSize: file.rawSize,
          imageData: file.base64Image,
          exercise: [],
          patient: self.get("patientsData")
        });

        newFile.save().then(()=>{
          if (this.get('flagAdd')=== true)
            this.set('flagAdd', false);
          else
            this.set('flagAdd', true);

          this.get('array').pushObject(newFile);

          this.set('disabled', '')
        });
      }

      );
      this.queue.clear();

      // window.location.reload();
      // windows.location.reload();
    },

  }

});
