import dayjs, {Dayjs} from "dayjs";

export function friendlyDate(date:string|Date|null):string|null {
    if (!date) {
        return null;
    }
    const d = dayjs(date);
    const today = dayjs();
    if (!d.isValid()) {
        return null;
    }
    if (d.isSame(today, 'year')) {
        return d.format('MM/DD');
    }
    return d.format('MM/DD/YYYY');
}

export function toLocalizedDate(date:dayjs.Dayjs|Date|string|null|undefined):Dayjs|null {
    if (!date) {
        return null;
    }
    const _date = dayjs(date);
    if (!_date.isValid()) {
        return null;
    }
    return _date.add(new Date().getTimezoneOffset(), 'minute').startOf('day');
}
