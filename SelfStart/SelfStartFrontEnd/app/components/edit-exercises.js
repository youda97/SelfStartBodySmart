import Component from '@ember/component';
import Ember from 'ember';
import fileObject from "../utils/file-object";

export default Component.extend({
  DS: Ember.inject.service('store'),

  //tagName: '',
  cbState: false,
  newActionSteps: [],
  oldActionSteps: [],
  temp: [],
  // ImageName: null,
  images: null,
  model: 'image',
  flag: null,
  accept: 'audio/*,video/*,image/*',
  multiple: true,
  queue: [],
  modelQueue: [],
  savingInProgress: false,
  isEditing: false,
  //ID: null,
  exerID: null,
  secQueue: [],
  removeImages: [],
  numberOfActionSteps: -1,


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
  exercisesData: null,
  flagEdit: false,
  //
  // Description: Ember.computed.oneWay('exercisesData.description'),
  // Name: Ember.computed.oneWay('exercisesData.name'),
  // AuthName: Ember.computed.oneWay('exercisesData.authorName'),
  actionStep: Ember.computed.oneWay('exercisesData.actionSteps'),
  // sets: Ember.computed.oneWay('exercisesData.sets'),
  // reps: Ember.computed.oneWay('exercisesData.reps'),
  // Duration: Ember.computed.oneWay('exercisesData.duration'),
  // MMURL: Ember.computed.oneWay('exercisesData.multimediaURL'),
  // Imgs: Ember.computed.oneWay('exercisesData.images'),

  modalName: Ember.computed(function () {
    return 'editExercise' + this.get('exercisesData').id;
  }),

  actions: {
    addOption: function(){
      this.set('numberOfActionSteps', this.numberOfActionSteps + 1);
      console.log(this.numberOfActionSteps);
      let newObj = Ember.Object.create({
        name: "New Action Step",
        id: this.numberOfActionSteps,
        value: null,
      })
      this.newActionSteps.pushObject(newObj);
    },

    removeOption: function(index){
      var removeOld = this.oldActionSteps.filterBy('id', index);
      var removeNew = this.newActionSteps.filterBy('id', index);
      removeOld.forEach(o => {
        this.oldActionSteps.removeObject(o);
      });
      removeNew.forEach(o => {
        this.newActionSteps.removeObject(o);
      });

    },

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

    deleteFile: function (image) {
      console.log(image.id);
      console.log(this.images);
      console.log(this.exerID);

      this.secQueue.removeObject(image);
      this.removeImages.pushObject(image);
    },

    done: function () {
      this.get('queue').clear();
      this.set('flag', false);
    },

    addTempImage: function(image) {
      console.log(image);
      this.temp.push(image);
      console.log(image.name);
    },

    openModal: function () {
      // window.location.reload();
      this.secQueue.clear();
          console.log(this.images);
          this.images.forEach(file => {
            this.secQueue.pushObject(file);
          });

          console.log(this.get("actionStep"));
          // console.log(this.exercisesData);

          this.get('actionStep').forEach(o => {
            this.set('numberOfActionSteps', this.numberOfActionSteps + 1);
            console.log(this.numberOfActionSteps);
            let newObj = Ember.Object.create({
              name: "New Action Step",
              id: this.numberOfActionSteps,
              value: o,
            })
        this.oldActionSteps.pushObject(newObj);
      });

      //this.set('exerciseData', this.get('DS').peekRecord('exercise', this.get('ID')));

      Ember.$('.ui.' + this.get('modalName') + '.modal').modal({
        closable: false,
        transition: 'horizontal flip',
        centered: false,
        // dimmerSettings: { opacity: 0.25 },
        onHide: function(){
          console.log('hidden');

        },
        onDeny: () => {

       return true;
        },
      })
        .modal('show');
    },


    onClose(){
      this.set('newActionSteps', []);
      this.set('oldActionSteps', []);
      this.set('secQueue', []);
      this.set('removeImages', []);
      this.set('queue', []);
      console.log(this.get('newActionSteps'));
      console.log(this.get('oldActionSteps'));
    },

    submit(){
      this.removeImages.forEach(file => {
        console.log(file);
        this.get('DS').findRecord('image', file.id).then((rec) => {
          rec.destroyRecord();
          rec.save();
        });
      });
      let secQueue2 = [];
      let self = this;
      this.get('temp').forEach(function(obj) {
        secQueue2.push(obj);
      })

      this.get('temp').clear();

      this.queue.forEach(file => {

        console.log(file);

        this.get('DS').findRecord('exercise',  this.get('exercisesData').id).then((rec)=>{

          // console.log("sasdasd", exe);
          var newFile = this.get('DS').createRecord('image', {
            name: file.name,
            size: file.size,
            type: file.type,
            rawSize: file.rawSize,
            imageData: file.base64Image,
            exercise: []
          });

          // var exe = this.get('DS').findRecord('exercise', this.get('ID'));
          // newFile.save();

          newFile.get('exercise').pushObject(rec);
          newFile.save();

          rec.get('images').pushObject(newFile);
          this.get('DS').findRecord('exercise',  this.get('exercisesData').id).then((rec)=>{
            rec.save();

          });
        });
      });

      this.get('DS').findRecord('exercise',  this.get('exercisesData').id).then((rec)=>{
        secQueue2.forEach(file => {
          this.get('DS').findRecord(this.get('model'), file.get('id')).then((obj) =>{
            obj.get('exercise').pushObject(rec);
            obj.save();
            rec.get('images').pushObject(obj);
          })
        });
      });

      let actionS = [];
      this.get('oldActionSteps').forEach(o => {
        console.log(o.value);
        actionS.push(o.value);
      });

      this.get('newActionSteps').forEach(o => {
        console.log(o.value);
        actionS.push(o.value);
      })

      this.get('DS').findRecord('exercise' , this.get('exercisesData').id).then((rec)=>{
        rec.set('name', this.get('exercisesData.name'));
        rec.set('description', this.get('exercisesData.description'));
        rec.set('authorName', '');
        rec.set('sets', this.get('exercisesData.sets'));
        rec.set('reps', this.get('exercisesData.reps'));
        rec.set('actionSteps', actionS);
        rec.set('duration', this.get('exercisesData.duration'));
        rec.set('multimediaURL', this.get('exercisesData.multimediaURL'));
        // rec.set('exercises', this.get('exercises'));
        // rec.set('assessmentTests', this.get('assessmentTests'));
        rec.save().then(()=>{

          this.get('newActionSteps').clear();
          this.get('oldActionSteps').clear();
          this.secQueue.clear();
          this.removeImages.clear();
          this.queue.clear();
          if (this.get('flagEdit')=== true)
            this.set('flagEdit', false);
          else
            this.set('flagEdit', true);
          $('.ui.' + this.get('modalName') + '.modal').modal('hide');
        });
      });
    },

    addObjective: function(){
      let newObj = this.get('Objective');
      this.get('obj').pushObject(newObj);
      this.set('Objective', "");
    },

    addActionStep(){
      let newActStep = this.get('ActionSteps');
      this.get('actionStep').pushObject(newActStep);
      this.set('ActionSteps', "");
    },

    deleteNewFile(file){
      this.get('queue').removeObject(file);
      if (Ember.isEmpty(this.get('queue'))) {
        this.set('flag', false);
      }
    }
  }
});
