import Component from '@ember/component';
import { inject } from '@ember/service';
import $ from 'jquery';
import Ember from "ember";

export default Component.extend({
  DS: inject('store'),

  shortAns: false,
  multipleChoice:true,
  rating: false,
  trueFalse:false,
  option2:false,
  option3:false,
  option4:false,
  option5:false,
  option6:false,
  oNumber:1,
  removable: false,
  addable:true,
  flagAdd: null,

  typeChange: Ember.observer('type', function(){
    if('multipleChoice' === this.get('type')){
      this.set('multipleChoice', true);
      this.set('shortAns', false);
      this.set('trueFalse', false);
      this.set('rating',false);
    }
    else if('shortAns' === this.get('type')){
      this.set('shortAns', true);
      this.set('multipleChoice', false);
      this.set('trueFalse', false);
      this.set('rating',false);
    }
    else if('rating' === this.get('type')){
      this.set('shortAns', false);
      this.set('multipleChoice', false);
      this.set('trueFalse', false);
      this.set('rating',true);
    }
    else if('trueFalse' === this.get('type')){
      this.set('shortAns', false);
      this.set('multipleChoice', false);
      this.set('trueFalse', true);
      this.set('rating',false);
    }
  }),

  actions: {
    openModal: function ()  {
      $('.ui.newQuestion.modal').modal({
        closable: false,

        onDeny: () => {
          return true;
        },

      }).modal('show')
    },

    addOption(){
      if(this.option2 === false){
        this.set('option2', true);
        this.set('removable', true);
        this.oNumber++;
        return;
      }
      if(this.option3 === false){
        this.set('option3', true);
        this.oNumber++;
        return;
      }
      if(this.option4 === false){
        this.set('option4', true);
        this.oNumber++;
        return;
      }
      if(this.option5 === false){
        this.set('option5', true);
        this.oNumber++;
        return;
      }
      if(this.option6 === false){
        this.set('option6', true);
        this.set('addable', false);
        this.oNumber++;
        return;
      }
    },

    removeOption(){
      if(this.option6 === true){
        this.set('option6', false);
        this.set('addable', true);
        this.oNumber--;
        return;
      }
      if(this.option5 === true){
        this.set('option5', false);
        this.oNumber--;
        return;
      }
      if(this.option4 === true){
        this.set('option4', false);
        this.oNumber--;
        return;
      }
      if(this.option3 === true){
        this.set('option3', false);
        this.oNumber--;
        return;
      }
      if(this.option2 === true){
        this.set('option2', false);
        this.set('removable', false);
        this.oNumber--;
        return;
      }
    },

    submit: function () {

      let question, help, qtype, optStr = '';

      let self = this;

      if(this.shortAns){
        help = self.get('sahelp');
        question = self.get('question');
        qtype = "Short answer";
      }
      if(this.multipleChoice){
        help = self.get('mchelp');
        question = self.get('question');
        qtype = "Multiple choice";

        for(let i = 1; i <= this.oNumber; i++){
          optStr += self.get('mcop' + i);
          optStr += "+++";
        }
      }
      if(this.trueFalse){
        help = self.get('tfhelp');
        question = self.get('question');
        qtype = "True/False";
      }

      if(this.rating){
        help = self.get('rhelp');
        question = self.get('question');
        qtype = "Rating";
      }


      let newQuestion = this.get('DS').createRecord('question', {

        helpDescription: help,
        questionText: question.charAt(0).toUpperCase() + question.substring(1),
        type: qtype,
        optionNumber: this.oNumber,
        optionString: optStr,
        mc: this.multipleChoice,
        tf: this.trueFalse,
        ra: this.rating,
        sa: this.shortAns
      });

      newQuestion.save().then(function() {
        if (self.get('flagAdd')=== true)
          self.set('flagAdd', false);
        else
          self.set('flagAdd', true);
        $('.ui.newQuestion.modal').modal('hide');
      });
    }
  },
});
