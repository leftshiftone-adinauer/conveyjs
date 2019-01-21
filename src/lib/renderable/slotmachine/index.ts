import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';

/**
 * Implementation of the 'reel' markup element.
 */
export class SlotMachine implements IRenderable {

    private readonly spec: ISpecification;

    constructor(message: ISpecification) {
        this.spec = message;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer:IRenderer, isNested:boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const slotMachine = document.createElement("div");
        slotMachine.classList.add('lto-slotmachine', "lto-" + position);

        const elements = (this.spec.elements || []).map(e => renderer.render(e, "slotmachine"));
        elements.forEach(e => e.forEach(x => slotMachine.appendChild(x)));

        if (isNested) {
            slotMachine.classList.add('lto-nested');
        }

        return slotMachine;
    }

}
