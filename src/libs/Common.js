
export function calculateAge(birthday: Date) { // birthday is a date
    var ageDifMs = Date.now() - new Date(birthday).getTime()
    var ageDate = new Date(ageDifMs) // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export function delay(ms?: number = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
