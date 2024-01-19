import moment from 'moment';
import 'moment-precise-range-plugin';

export const convertToTimeReadable = (startTime: string, endTime: string) => {
  let s = moment.preciseDiff(moment(startTime), moment(endTime));
  s = s.replace('seconds', 's');
  s = s.replace('second', 's');
  s = s.replace('minutes', 'm');
  s = s.replace('minute', 'm');
  s = s.replace('hours', 'h');
  s = s.replace('hour', 'h');
  s = s.replace('days', 'd');
  s = s.replace('day', 'd');
  s = s.replace(' h', 'h');
  s = s.replace(' m', 'm');
  s = s.replace(' s', 's');
  return s;
};
