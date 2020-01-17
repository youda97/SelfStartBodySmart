import { helper } from '@ember/component/helper';

export function numberOfMC([numOps, curNum]) {
    return numOps > curNum;
}

export default helper(numberOfMC);
