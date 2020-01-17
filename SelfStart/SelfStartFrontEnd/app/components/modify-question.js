import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  DS: inject('store'),
  questionData: null,
  questionText: computed.oneWay('questionData.questionText'),
  helpDescription: computed.oneWay('questionData.helpDescription'),
  questionType: computed.oneWay('questionData.type'),
  multipleChoice: false,
  opt2: false,
  opt3: false,
  opt4: false,
  opt5: false,
  opt6: false,
  opt1String: " ",
  opt2String: " ",
  opt3String: " ",
  opt4String: " ",
  opt5String: " ",
  opt6String: " ",
  optString: " ",

  modalName: computed(function() {
    return 'questionData' + this.get('ID');
  }),
  actions: {

    isMultipleChoice: function() {
      // console.log(this.get('questionData.type'));
      if(this.get('questionData.type') === "Multiple choice"){
        this.set('multipleChoice',true);
        let breakdown = this.get('questionData.optionString').split('+++');

        if(this.get('questionData.optionNumber') === 6){
          this.set('opt2', true);
          this.set('opt3', true);
          this.set('opt4', true);
          this.set('opt5', true);
          this.set('opt6', true);
          for(let i = 0; i < 6;i++){
            this.set('opt' +(i+1) + 'String', breakdown[i]);
          }
        }

        else if (this.get('questionData.optionNumber') === 5) {
          this.set('opt2', true);
          this.set('opt3', true);
          this.set('opt4', true);
          this.set('opt5', true);
          for(let j = 0; j < 5;j++){
            this.set('opt' +(j+1) + 'String', breakdown[j]);
          }
        }

        else if (this.get('questionData.optionNumber') === 4) {
          this.set('opt2', true);
          this.set('opt3', true);
          this.set('opt4', true);
          for(let k = 0; k < 4;k++){
            this.set('opt' +(k+1) + 'String', breakdown[k]);
          }
        }

        else if (this.get('questionData.optionNumber') === 3) {
          this.set('opt2', true);
          this.set('opt3', true);
          for(let l = 0; l < 3;l++){
            this.set('opt' +(l+1) + 'String', breakdown[l]);
          }
        }

        else if (this.get('questionData.optionNumber') === 2) {
          this.set('opt2', true);
          for(let m = 0; m < 2;m++){
            this.set('opt' +(m+1) + 'String', breakdown[m]);
          }
        }
      }
      else
        this.set('multipleChoice',false);
    },

    openModal: function () {
      this.set('questionData', this.get('DS').peekRecord('question', this.get('ID')));

      $('.ui.' + this.get('modalName') + '.modal').modal({
        closeable: false,
        transaction: 'horizontal flip',
        onDeny: () => {
          return true;
        },
      })
        .modal('show');
    },

    submit(){

      var text = this.get('questionData.questionText');

      if(this.get('questionData.type') === "Multiple choice"){
        this.set('optString', "");
        for(let i =0; i < this.get('questionData.optionNumber'); i++){
          this.set('optString', this.get('optString') + this.get('opt' + (i+1) + 'String'));
          this.set('optString', this.get('optString') + '+++');
        }

      }
      this.get('DS').findRecord('question', this.get('questionData').id).then((rec) => {
        rec.set('questionText', text.charAt(0).toUpperCase() + text.substring(1),);
        rec.set('optionString', this.get('questionData.optString'));
        rec.set('helpDescription', this.get('questionData.helpDescription'));
        rec.save().then(()=>{
          $('.ui.' + this.get('modalName') + '.modal').modal('hide');
        });
      })
    }
  }

});
