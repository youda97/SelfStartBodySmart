import Component from '@ember/component';

export default Component.extend({
    init: function() {
        this._super();
         if(this.get('name.type') == "Multiple choice"){
               this.set('multiplechoice',true);
               var breakdown = this.get('name.questionText').split('+++');
               this.set("string", breakdown[0]);
           }
     },
    
    multiplechoice: false,
    string: "",
});