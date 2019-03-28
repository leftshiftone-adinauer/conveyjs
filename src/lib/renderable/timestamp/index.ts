export class Timestamp {

    public static render() {
        const date = new Date();
        const f = (e: any) => e.toString().padStart(2, '0');
        const text = f(date.getHours()) + ':' + f(date.getMinutes());
        const timestamp = document.createElement('small');
        timestamp.classList.add('lto-timestamp');
        timestamp.appendChild(document.createTextNode(text));
        return timestamp;
    }
}
