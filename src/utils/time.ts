// A function that takes a date in this format "2023-04-03 14:23:33" where the year is 2023, the month is April and the day is 3rd. The function returns the day of the week in this format "2023-04-03 - Miércoles".
export const getDayOfWeek = (date: string | undefined): string => {
    if (!date) return '';
    const [dayDate, time] = date.split(' ')
    const [year, month, day] = dayDate.split('-')
    const dayOfWeek = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('es-ES', { weekday: 'long' });
    return `${dayDate} ${time.slice(0, 5)} - ${dayOfWeek[0].toUpperCase()}${dayOfWeek.slice(1)}`;
}
