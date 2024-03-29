export function toHexString(byteArray: number[] | undefined) {
    if (!byteArray) return ''
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}
