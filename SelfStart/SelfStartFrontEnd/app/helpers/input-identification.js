import { helper } from '@ember/component/helper';

export function inputIdentification(questionNumber) {
  var str = "";
  for(let i = 0; i < questionNumber; i++){
    str.concat("a");
  }
  console.log(str);
  return str;
}

export default helper(inputIdentification);
