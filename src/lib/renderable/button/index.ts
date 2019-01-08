import {AbstractRenderable} from '../AbstractRenderable';
import {IRenderer} from '../../api/IRenderer';

export class Button extends AbstractRenderable {

    public text: string;
    public buttonName: string;
    public value: string;
    public position: string;

    constructor(message: any) {
        super('button');
        this.text = message.text;
        this.buttonName = message.name;
        this.value = message.value;
        this.position = message.position;
    }

    public render(renderer:IRenderer, container: HTMLElement, sendMessage: (msg:any) => void) {
        console.debug('Send message function: ');
        console.debug(sendMessage);

        const position = this.position || 'left';
        const button = document.createElement('button');
        button.setAttribute('name', this.buttonName);

        if (!Button.isNested(container)) {
            button.classList.add('button', position);
        } else {
            button.classList.add('button-nested', position);
        }
        button.appendChild(document.createTextNode(this.text));
        container.appendChild(button);
        button.addEventListener('click', () => {
            sendMessage({
                    type: 'button',
                    text: this.text,
                    attributes: {type: 'button', name: this.buttonName, value: this.value}
                },
            );
        });
    }
}
