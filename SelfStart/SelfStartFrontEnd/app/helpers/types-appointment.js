import { helper } from '@ember/component/helper';
import  moment from 'moment';
export function typesAppointment(_start) {

  let start = moment(_start[0], 'YYYY-MM-DD hh:mm A');
  let end = moment (_start[1]);


  let a = moment.duration(end.diff(start));
  if (a > 3600000)
  return "Initial Assessment";
  else
    return"Physiotherapy Treatment";
}

export default helper(typesAppointment);
