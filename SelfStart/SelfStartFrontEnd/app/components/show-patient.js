import Component from '@ember/component';
import { computed } from '@ember/object';


export default Component.extend({

  dateFormat: computed(function(){
    var date = this.get('model').get('dateOfBirth');
    var dateString = date.toISOString().substring(0, 10);
    return dateString;
  }),
});
