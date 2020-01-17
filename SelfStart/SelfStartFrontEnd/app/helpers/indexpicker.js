import { helper } from '@ember/component/helper';

export function indexpicker(params/*, hash*/) {
  return parseInt(params) +1;
}

export default helper(indexpicker);
