import { differenceInCalendarDays, parse, endOfYear, format } from 'date-fns';
export default function (itemDate) {
    let dbDate = parse(itemDate, 'yyyy-MM-dd', new Date())
    let DaysuntilNewYear = differenceInCalendarDays(endOfYear(new Date()), new Date());
    let dateString;
    const difference = differenceInCalendarDays(dbDate, new Date());
    switch (true) {
        case difference === 0:
            dateString = 'Today'
        break;
        case difference === 1:
            dateString = 'Tomorrow';
        break;
        case difference === -1:
            dateString = 'Yesterday';
        break;
        case difference < -1:
            dateString = {date: format(dbDate, 'E, dd MMM'), past: true};
        break;
        case difference <= DaysuntilNewYear:
            dateString = format(dbDate, 'E, dd MMM');
        break;
        case difference > DaysuntilNewYear:
            dateString = format(dbDate, 'E, dd MMM yyyy');
        break;
    }

    return dateString;
}