import {IRenderer, IRenderable, ISpecification} from '../../api';
import node, {INode} from "../../support/node";
import Renderables from "../Renderables";
import {Overlay} from "../overlays/Overlay";

/**
 * Implementation of the 'trigger' markup element.
 * The trigger element is used to trigger the overlay element with the same name as the tirgger.
 */
export class Trigger implements IRenderable {

    private readonly spec: ISpecification;

    /**
     * Constructor
     * @param spec evaluated specifications are:
     *      name: the name of the trigger
     *      text: the inner text of the trigger
     */
    constructor(spec: ISpecification) {
        this.spec = spec;
    }

    /**
     * {@inheritDoc}
     * The render method receives the trigger markup and creates an HTML element.
     *
     * Class which is set per default: <b>lto-trigger</b>
     *
     * @param renderer can render furthermore nested elements if they exist
     * @param isNested if the HTML element is nested
     *
     * @returns {@link HTMLDivElement} DOM representation of the trigger markup
     */
    public render(renderer: IRenderer, isNested: boolean): HTMLElement {
        const trigger = node("div");
        trigger.addClasses("lto-trigger");
        trigger.setId(this.spec.id);
        trigger.setName(this.spec.name);
        trigger.innerText(this.spec.text);

        this.spec.class !== undefined ? trigger.addClasses(this.spec.class) : () => {};

        trigger.onClick(() => {
            const overlay = this.getOverlayFromContainer(trigger.getParentByClass("lto-container"));
            if (!overlay) {
                console.error(`No overlay with name ${this.spec.name} found`);
                return
            }
            Overlay.show(overlay);
        });

        return trigger.unwrap();
    }

    private getOverlayFromContainer(container?: INode): INode | undefined {
        if (!container) return;
        return container.findAll(`.lto-overlays .lto-overlay[name="${this.spec.name!}"]`)[0]
    }

}

Renderables.register("trigger", Trigger);
