import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'link' markup element.
 */
export class Link implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const link = document.createElement('a');
        link.setAttribute('href', this.spec.value || "");
        link.setAttribute('target', '_blank');
        link.classList.add('lto-link');
        if (this.spec.id !== undefined) {
            link.id = this.spec.id;
        }
        if (this.spec.class !== undefined) {
            this.spec.class.split(" ").forEach(e => link.classList.add(e));
        }
        link.appendChild(document.createTextNode(this.spec.text || ""));

        return link;
    }

}

Renderables.register("link", Link);
