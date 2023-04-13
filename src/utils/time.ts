// A function that takes a date in this format "2023-04-03 14:23:33" where the year is 2023, the month is April and the day is 3rd. The function returns the day of the week in this format "2023-04-03 - Miércoles".
export const getDayOfWeek = (date: string): string => {
    const [year, month, day] = date.split(' ')[0].split('-');
    const dayOfWeek = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('es-ES', { weekday: 'long' });
    return `${date} - ${dayOfWeek[0].toUpperCase()}${dayOfWeek.slice(1)}`;
}
