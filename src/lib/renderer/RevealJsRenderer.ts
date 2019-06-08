import {ContentCentricRenderer} from './ContentCentricRenderer';
import {IRenderable} from '../api/IRenderable';
import {IStackeable} from '../api/IStackeable';
import {Defaults} from '../support/Defaults';
// @ts-ignore
import * as Reveal from "reveal.js/js/reveal.js";
import {ISpecification} from '../api/IRenderer';

/**
 * Renderer implementation which is based on the reveal.js library.
 * This renderer supports horizontal as well as vertical navigation.
 */
export class RevealJsRenderer extends ContentCentricRenderer {

    constructor(options?: {}, content?: HTMLElement, suggest?: HTMLElement) {
        super(RevealJsRenderer.wrapContent(content), suggest);

        Reveal.initialize(options || {
            controls: false,
            progress: false,
            center: false,
            transitionSpeed: "slow"
        });
        this.scrollStrategy = () => {
        };
    }

    public render(message: ISpecification | IRenderable, containerType?: IStackeable): HTMLElement[] {
        if (message["render"] === undefined) {
            // do not render renderables with position 'right'
            // ***********************************************
            if ((message as ISpecification).position === "right") {
                return [];
            }
        }
        return super.render(message, containerType);
    }

    protected renderElement(renderable: IRenderable, containerType?: IStackeable): HTMLElement[] {
        const elements = super.renderElement(renderable, containerType);

        // wrap renderables with class lto-container into a section element
        // ****************************************************************
        if (elements[0].classList.contains("lto-container")) {
            const section = document.createElement("section");
            elements.forEach(e => section.appendChild(e));

            document.querySelectorAll("section.present").forEach(e => {
                e.classList.remove("present");
                e.classList.add("past");
            });
            section.classList.add("present");

            return [section];
        }
        return elements;
    }

    private static wrapContent(content?: HTMLElement): HTMLElement {
        const div1 = document.createElement("div");
        const div2 = document.createElement("div");

        div1.classList.add("reveal");
        div2.classList.add("slides");

        (content || Defaults.content()).appendChild(div1);
        div1.appendChild(div2);

        return div2;
    }

    public appendContent = (element: HTMLElement) => {
        this.content.appendChild(element);
        Reveal.sync();
    };

}
