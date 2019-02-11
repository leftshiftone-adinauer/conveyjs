import {IRenderer, ISpecification} from '../../api/IRenderer';
import {IRenderable} from '../../api/IRenderable';
import Renderables from '../Renderables';

/**
 * Implementation of the 'slider' markup element.
 */
export class Slider implements IRenderable {

    private readonly spec: ISpecification;

    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const position = this.spec.position || 'left';
        const slider = document.createElement('input');

        slider.setAttribute("type", "range");
        slider.setAttribute('max', this.spec.max || "");
        slider.setAttribute('step', this.spec.step || "");
        slider.setAttribute('name', this.spec.name || "");
        // @ts-ignore
        slider.setAttribute('value', isNaN(this.spec.value) ? "" : this.spec.value);
        // @ts-ignore
        slider.setAttribute('min', isNaN(this.spec.min) ? "" : this.spec.min);
        slider.addEventListener('change', () => {
            slider.setAttribute('value', slider.value);
        });

        slider.classList.add("lto-slider", "lto-" + position);
        if (this.spec.class !== undefined) slider.classList.add(this.spec.class);

        if (!this.spec.horizontal) {
            slider.style.transform = "rotate(90deg)";
        }

        slider.step = this.spec.step || "";

        if (isNested) {
            slider.classList.add("lto-nested");
        }

        slider.appendChild(document.createTextNode(this.spec.text || ""));

        return slider;
    }
}

Renderables.register("slider", Slider);
