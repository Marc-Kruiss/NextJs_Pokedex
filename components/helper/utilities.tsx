export function numberToThreeBasedString(number:number) {
    return ("000" + number).slice(-3).toString()
}