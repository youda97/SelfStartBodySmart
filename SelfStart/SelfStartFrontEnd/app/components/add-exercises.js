import Component from '@ember/component';
// import { computed } from '@ember/object';
import { inject } from '@ember/service';
import Ember from 'ember';
import fileObject from "../utils/file-object";
import moment from 'moment';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  cbState: false,
  temp: [],
  queue2:[],
  // ImageName: null,
  model: 'image',
  flag: null,
  accept: 'audio/*,video/*,image/*',
  multiple: true,
  queue: [],
  modelQueue: [],
  savingInProgress: false,
  id: null,
  actionSteps: [],
  numberOfActionSteps: -1,
  flagAdd: null,


  modalName: Ember.computed(function () {
    return 'add-exercise' + this.get('id');
  }),

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

  actions: {
    addOption: function(){
      this.set('numberOfActionSteps', this.numberOfActionSteps + 1);
      console.log(this.numberOfActionSteps);
      let newObj = Ember.Object.create({
        name: "New Action Step",
        id: this.numberOfActionSteps,
        value: null,
      })
      this.actionSteps.pushObject(newObj);
    },

    removeOption: function(index){
      var remove = this.actionSteps.filterBy('id', index);
      remove.forEach(o => {
        this.actionSteps.removeObject(o);
      })
    },

    selectFile: function (data) {
      if (!Ember.isEmpty(data.target.files)) {
        for (let i = data.target.files.length - 1; i >= 0; i--) {
          let file = fileObject.create({
            fileToUpload: data.target.files[i],
            maximumFileSize: 6
          });

          console.log(file);

          // var newFile = this.get('DS').createRecord(this.get('model'), {
          //     name: this.ImageName,
          //     size: file.size,
          //     type: file.type,
          //     rawSize: file.rawSize,
          //     imageData: file.base64Image
          // });
          // newFile.save();
          this.get('queue').pushObject(file);
          // this.get('modelQueue').pushObject(newFile);
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


    submit: function() {
      let date = moment().format("MMM Do YY");
      var exerName =  this.get('name');

      let actS = [];
      actS.push(this.get('ActionStep1'));
      this.actionSteps.forEach(o => {
        actS.push(o.value);
      })

      let exercise = this.get('DS').createRecord('exercise', {

        name: exerName.charAt(0).toUpperCase() + exerName.substring(1),
        description:this.get('description'),
        authorName:this.get('authorName'),
        actionSteps:actS,

        sets:this.get('sets'),
        reps:this.get('reps'),
        duration:this.get('duration'),
        multimediaURL:this.get('multimediaURL'),
        images: [],
        dateCreated: date
      });

      console.log(this.queue);
      let self = this;
      let secQueue = [];
      let secQueue2 = [];

      this.queue.forEach(file => {
        secQueue.pushObject(file);
      });
      console.log("this is q2", this.queue2);
      this.queue2.forEach(file => {
        secQueue2.push(file);
      })

      this.queue2.forEach(file => {
        secQueue2.push(file);
      });

      this.get('temp').forEach(function(obj) {
        secQueue2.push(obj);
      });

      this.get('temp').clear();

      exercise.save().then((exer)=>{
        if (this.get('flagAdd')=== true)
          this.set('flagAdd', false);
        else
          this.set('flagAdd', true);

        var saveImage = [];
        console.log(exer.id);
        console.log(this.queue);
        console.log(secQueue);
        secQueue.forEach(file => {
          console.log("akjdajsdkasjd");
          var newFile = this.get('DS').createRecord(this.get('model'), {
            name: file.name,
            size: file.size,
            type: file.type,
            rawSize: file.rawSize,
            imageData: file.base64Image,
            exercise: []
          });

          newFile.get('exercise').pushObject(exercise);
          newFile.save();

          exercise.get('images').pushObject(newFile);
          this.get('DS').findRecord('exercise', exer.id).then((rec)=>{
            rec.save();
          });

        });

        secQueue2.forEach(file => {
          this.get('DS').findRecord(this.get('model'), file.get('id')).then((obj) =>{
            obj.get('exercise').pushObject(exercise);
            obj.save();
            exercise.get('images').pushObject(obj);
          })
        });
      });


      this.set('ActionStep1', "");
      this.get('actionSteps').clear();
      this.set('numberOfActionSteps', -1);
      this.set('authorName', "");
      this.set('actionSteps', "");
      this.get('queue').clear();
      this.get('queue2').clear();
      this.set('name', "");
      this.set('description', "");
      this.set('authorName', "");
      this.set('actionStep', "");
      this.set('reps', "");
      this.set('sets', "");
      this.set('duration', "");
      this.set('multimediaURL', "");
      this.set("actionSteps", []);

      $('.ui.newExercise.modal').modal('hide');


    },

    addTempImage: function(image) {
      console.log(image);
      this.temp.push(image);
      console.log(image.name);
    },

    openModal: function ()  {
      $('.ui.newExercise.modal').modal({
        closable: false,

        onDeny: () => {
          return true;
        },

      }).modal('show')
    },
  }
});
