export const formatSum = (number) => {
    number = number.replace(/^\[club(\d+)\|(.*)\]/i, '').trim();
    number = number.replace(/(к|k)/ig, '000');
    number = Number(Number.parseFloat(number.replace(/\s/g, '')).toFixed(3))

    return number
}