import dayjs from "dayjs";

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
