import { helper } from '@ember/component/helper';

export function indexPlusOne(index) {
  return parseInt(index) + 1;
}
export default helper(indexPlusOne);
