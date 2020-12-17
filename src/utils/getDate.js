module.exports = getCurrentTime = () => {
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    const dateTime = `${date} ${time}`
    return dateTime
}