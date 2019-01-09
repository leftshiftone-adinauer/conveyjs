import {AbstractRenderable} from '../renderable/AbstractRenderable';
import {Button} from "../renderable/button";
import {AbstractRenderer} from './AbstractRenderer';
import {Link} from '../renderable/link';

/**
 * The classic renderer renders the G.A.I.A. messages in a classic top-down manner.
 */
export class ClassicRenderer extends AbstractRenderer {

    protected readonly container: HTMLElement;

    constructor(container: HTMLElement) {
        super();
        this.container = container;
    }

    protected renderElement(renderable: AbstractRenderable, sendMessage: any):void {
        renderable.render(this, this.container, sendMessage);

        if (this.needsSeparator(renderable)) {
            const div = document.createElement('div');
            div.classList.add('separator');
            div.classList.add('separator-' + renderable.name);
            this.container.appendChild(div);

            const objDiv = document.querySelector('.gaia-chat .scrollbar');
            if (objDiv != null) {
                objDiv.scrollTop = objDiv.scrollHeight;
            }
        }
    }

    // noinspection JSMethodCanBeStatic
    private needsSeparator(renderable:AbstractRenderable) {
        if (renderable instanceof Button) {
            if ((renderable as Button).position !== 'right') {
                return false;
            }
        } else if (renderable instanceof Link) {
            return false;
        }
        return true;
    }

}
