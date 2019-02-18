// noinspection TsLint
import "./Line.scss";
import LineOptions from './LineOptions';
import * as d3 from "d3";

/**
 * Implementation of the 'line' markup element.
 */
export class Line {

    private options: LineOptions;

    constructor(options: LineOptions = new LineOptions()) {
        this.options = options;
    }

    /**
     * {@inheritDoc}
     */
    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-line");
        div.innerHTML = `<svg width="${this.options.width}" height="${this.options.height}" viewBox="0,0,${this.options.width},${this.options.height}" />`;
        return div;
    }

    public init(element:HTMLElement) {
        this.options.data.then(data => {
            const svg = d3.select(element.querySelector("svg"));

            const dates = data.dates.map((e: number) => new Date(e));
            const line = d3.line().defined((d: any) => !isNaN(d)).x((d, i) => x(data.dates[i])).y(d => y(d));

            const x = d3.scaleTime()
            // @ts-ignore
                .domain(d3.extent(dates))
                .range([this.options.margin.left, this.options.width - this.options.margin.right]);

            const y = d3.scaleLinear()
            // @ts-ignore
                .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
                .range([this.options.height - this.options.margin.bottom, this.options.margin.top]);

            // @ts-ignore
            svg.append("g").call(this.xAxis(x));
            // @ts-ignore
            svg.append("g").call(this.yAxis(y, data));
            // @ts-ignore
            svg.append("g").call(this.grid(x));

            const path = svg.append("g")
                .attr("fill", "none")
                .attr("stroke", "rgb(0, 200, 220)")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .selectAll("path")
                .data(data.series)
                // @ts-ignore
                .join("path")
                .style("mix-blend-mode", "color-dodge")
                .attr("d", (d: any) => line(d.values));

            svg.call(this.hover(x, y, data), path);
        });
    }

    private xAxis(x: any) {
        return (g: d3.Selection<SVGGElement, {}, null, any>) => g
            .attr("transform", `translate(0,${this.options.height - this.options.margin.bottom})`)
            .call(d3.axisBottom(x).ticks(this.options.width / 80).tickSizeOuter(0));
    }

    private yAxis(y: any, data:any) {
        return (g: d3.Selection<SVGGElement, {}, null, any>) => g
            .attr("transform", `translate(${this.options.margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));
    }

    private hover(x: any, y: any, data:any) {
        return (svg: any, path: any) => {
            svg.style("position", "relative");

            if ("ontouchstart" in document) {
                svg
                    .style("-webkit-tap-highlight-color", "transparent")
                    .on("touchmove", moved)
                    .on("touchstart", entered)
                    .on("touchend", left);
            } else {
                svg
                    .on("mousemove", moved)
                    .on("mouseenter", entered)
                    .on("mouseleave", left);
            }

            const dot = svg.append("g").attr("display", "none");
            dot.append("circle").attr("r", 2.5);

            dot.append("text")
                .style("font", "10px sans-serif")
                .attr("text-anchor", "middle")
                .attr("y", -8);

            function moved() {
                d3.event.preventDefault();
                const ym = y.invert(d3.event.layerY);
                const xm = x.invert(d3.event.layerX);
                const i1 = d3.bisectLeft(data.dates, xm, 1);
                const i0 = i1 - 1;
                const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
                const s = data.series.reduce((a:any, b:any) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
                path.attr("stroke", (d: any) => d === s ? null : "#ddd").filter((d: any) => d === s).raise();
                dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
                dot.select("text").text(s.name);
            }

            function entered() {
                path.style("mix-blend-mode", null).attr("stroke", "#ddd");
                dot.attr("display", null);
            }

            function left() {
                path.style("mix-blend-mode", "color-dodge").attr("stroke", null);
                dot.attr("display", "none");
            }
        };
    }

    private grid(x: any) {
        return (g: d3.Selection<SVGGElement, {}, null, any>) => {
            g.append("path")
                .attr("class", "grid")
                .attr("stroke", "gray")
                .attr("d", `M ${this.options.margin.left} ${this.options.height / 3} L ${this.options.width - this.options.margin.right} ${this.options.height / 3} Z`);
            g.append("path")
                .attr("class", "grid")
                .attr("stroke", "gray")
                .attr("d", `M ${this.options.margin.left} ${this.options.height / 3 * 2} L ${this.options.width - this.options.margin.right} ${this.options.height / 3 * 2} Z`);
        };
    }

}
