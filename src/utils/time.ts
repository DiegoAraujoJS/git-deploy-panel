const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

const getMonthName = (month: number): string => monthNames[month] || '';

// A function that takes a date in this format "2023-04-03 14:23:33" where the year is 2023, the month is April and the day is 3rd. The function returns the day of the week in this format "3 de Abril 14:23 - Miércoles".
export const getDayOfWeek = (date: string | undefined): string => {
    if (!date) return '';
    const [dayDate, time] = date.split(' ')
    const [year, month, day] = dayDate.split('-').map(Number)
    const dayOfWeek = new Date(year, month - 1, day).toLocaleDateString('es-ES', { weekday: 'long' });
    return `${day} de ${getMonthName(month - 1)} ${time.slice(0, 5)} - ${dayOfWeek[0].toUpperCase()}${dayOfWeek.slice(1)}`;
}
