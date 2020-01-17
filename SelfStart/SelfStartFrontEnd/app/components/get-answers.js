import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({

  DS: inject('store'),
  SAanswer:"",
  rateValue: 0,
  mcop1: 0,
  mcop2: 0,
  mcop3: 0,
  mcop4: 0,
  mcop5: 0,
  mcop6: 0,
  a: [],
  assessment: null,

  init(){
    this._super(...arguments);
    //console.get(this.get("assessment"));

    let self = this;
    this.get('DS').findRecord('question',self.get("qID")).then((temp)=>{
      self.set('question', temp);
      self.get('answers').forEach((ans)=>{
        if (ans.get('question') === self.get('question.questionText')){
          self.set('SAanswer', ans.get('answer'));
        }
      });
      console.log(self.get('question'));
      console.log(self.get('SAanswer'));
    });
  },

  actions: {
    ratingSave(rv) {
      let self = this;
      this.set('rateValue', rv);
      console.log(this.get("assessment"));
      this.get("answers").forEach((rec) =>{
        if(rec.get('question') === self.get("question").get("questionText")){
          console.log("inside rating");
            rec.set('answer', self.get("rateValue"));
            rec.set('test', self.get("assessment"));
            rec.save();
        }
      });
    },

    TFtrue() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","YES");
            rec.set("test",self.get("assessment"));
            rec.save();

        }
      });
    },

    TFfalse() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","NO");
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
      },

    saSave() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer",self.get("SAanswer"));
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
    },

    mcop1Save() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","1");
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
    },

    mcop2Save() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","2");
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
    },

    mcop3Save() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","3");
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
    },

    mcop4Save() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","4");
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
    },

    mcop5Save() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","5");
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
    },

    mcop6Save() {
      let self = this;
      this.get("answers").forEach((rec) =>{
        if(rec.get("question") === self.get("question").get("questionText")){
            rec.set("answer","6");
            rec.set("test",self.get("assessment"));
            rec.save();
        }
      });
    },
  },

});
