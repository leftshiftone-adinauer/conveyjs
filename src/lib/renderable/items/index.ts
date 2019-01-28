import {Timestamp} from '../timestamp';
import {Icon} from '../icon';
import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';
import {IStackeable} from '../../api/IStackeable';

/**
 * Implementation of the 'items' markup element.
 */
export class Items implements IRenderable, IStackeable {

    public spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        if (!isNested) {
            const div = document.createElement('div');
            div.classList.add('lto-items');
            if (this.spec.class !== undefined) div.classList.add(this.spec.class);
            div.appendChild(Timestamp.render());

            const items = document.createElement('ul');
            div.appendChild(items);

            const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
            elements.forEach(e => e.forEach(x => items.appendChild(x)));
            div.appendChild(new Icon(this.spec.position || 'left').render());

            return div;
        }
        const items = document.createElement('ul');
        if (this.spec.class !== undefined) items.classList.add(this.spec.class);
        const elements = (this.spec.elements || []).map(e => renderer.render(e, this));
        elements.forEach(e => e.forEach(x => items.appendChild(x)));

        return items;
    }

}
Renderables.register("items", Items);
