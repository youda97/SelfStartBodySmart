import { helper } from '@ember/component/helper';

export default helper.extend({
  compute(qNum) {
    return qNum+1;
  }
});
