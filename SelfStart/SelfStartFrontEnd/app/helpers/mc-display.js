import { helper } from '@ember/component/helper';

export function mcDisplay([string, num]) {
  let breakdown = string.split('+++');
  var length = breakdown.length;
  if(num < length-1)
      return breakdown[num];
  return false;
}

export default helper(mcDisplay);
