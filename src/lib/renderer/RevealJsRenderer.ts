import {ContentCentricRenderer} from './ContentCentricRenderer';
import {IRenderable, ISpecification, IStackeable} from '../api';
import {Defaults} from '../support/Defaults';

/**
 * Renderer implementation which is based on the reveal.js library.
 * This renderer supports horizontal as well as vertical navigation.
 */
export class RevealJsRenderer extends ContentCentricRenderer {

    private Reveal: any;

    constructor(options?: {}, content?: HTMLElement, suggest?: HTMLElement) {
        super(RevealJsRenderer.wrapContent(content), suggest);

        if (document === undefined) {
            return
        }

        this.Reveal = require("reveal.js/js/reveal.js");
        this.Reveal.initialize(options || {
            controls: false,
            progress: false,
            center: true,
            hash: true,
            controlsLayout: 'bottom-right',
            autoSlide: 1,
            transition: 'slide',
        });

        this.scrollStrategy = () => {
        };
    }

    /**
     * @inheritDoc
     */
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

    /**
     * @inheritDoc
     */
    protected renderElement(renderable: IRenderable, containerType?: IStackeable): HTMLElement[] {
        const elements = super.renderElement(renderable, containerType);

        // wrap renderables with class lto-container into a section element
        // ****************************************************************
        const sections = document.getElementsByTagName("section");

        if (elements[0].classList.contains("lto-container") && !elements[0].outerHTML.includes("lto-transition")) {
            // create section
            console.trace("Reached container section");
            return this.createNewSection(elements, sections);
        } else if (elements[0].classList.contains("lto-container") && elements[0].outerHTML.includes("lto-transition")) {
            console.trace("Reached transition check");
            const transition = elements[0].firstElementChild;

            if (transition && transition.getAttribute("wrapped") === "in") {
                console.trace("Reached transition section");

                if (sections.length === 0) {
                    return this.createNewSection(elements, sections);
                }
                const lastSection = sections.item(sections.length - 1);
                if (lastSection) {
                    elements.forEach(e => lastSection.appendChild(e));
                    return [lastSection];
                }
            } else {
                return this.createNewSection(elements, sections);
            }
        }
        return elements;
    }

    private createNewSection(elements: HTMLElement[], sections: HTMLCollectionOf<HTMLElement>): HTMLElement [] {
        const section = document.createElement("section");
        elements.forEach(e => section.appendChild(e));

        document.querySelectorAll("section.present").forEach(e => {
            e.classList.remove("present");
            e.classList.add("past");
        });
        section.classList.add("present");

        return [section];
    }

    private static wrapContent(content?: HTMLElement): HTMLElement {
        const slidesDiv = document.createElement("div");
        slidesDiv.classList.add("slides");

        const revealDiv = document.createElement("div");
        revealDiv.classList.add('reveal');
        revealDiv.appendChild(slidesDiv);

        (content || Defaults.content()).appendChild(revealDiv);
        return slidesDiv;
    }

    public appendContent = (element: HTMLElement) => {
        this.content.appendChild(element);
        if (this.Reveal) {
            this.Reveal.sync();
        }
    };

}
