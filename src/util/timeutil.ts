export function timeTo4digit(date: Date) : string {
    return `${(date.getHours() + '').padStart(2, '0')}${(date.getMinutes() + '').padStart(2, '0')}`
}