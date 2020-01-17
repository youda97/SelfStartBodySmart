import { helper } from '@ember/component/helper';

export function compare([a,b]) {
  return a ===b;
}

export default helper(compare);
