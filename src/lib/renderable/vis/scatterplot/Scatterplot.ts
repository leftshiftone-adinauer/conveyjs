import * as d3 from "d3";
import data from "./data";
// noinspection TsLint
import d3tip from "d3-tip";
import ScatterplotOptions from './ScatterplotOptions';

export default class Scatterplot {

    private width:number;
    private height:number;

    constructor(options:ScatterplotOptions = new ScatterplotOptions()) {
        this.width = options.width;
        this.height = options.height;
    }

    public render() {
        const div = document.createElement("div");
        div.classList.add("lto-vis-scatterplot");

        return div;
    }

    public init(element:HTMLElement) {
        const margin = {top: 10, right: 10, bottom: 10, left: 10};
        const outerWidth = this.width;
        const outerHeight = this.height;
        const width = outerWidth - margin.left - margin.right;
        const height = outerHeight - margin.top - margin.bottom - 20;

        const x = d3.scaleLinear().range([0, width]).nice();
        const y = d3.scaleLinear().range([height, 0]).nice();

        const xCat = "xcat";
        const yCat = "ycat";
        const rCat = "rcat";
        const colorCat = "type";

        const xMax = (d3.max(data, (d: any) => d[xCat]) as number) * 1.05;
        let xMin = (d3.min(data, (d: any) => d[xCat]) as number);
        xMin = xMin > 0 ? 0 : xMin;

        const yMax = (d3.max(data, (d:any) => d[yCat]) as number) * 1.05;
        let yMin = (d3.min(data, (d:any) => d[yCat]) as number);
        yMin = yMin > 0 ? 0 : yMin;

        x.domain([xMin, xMax]);
        y.domain([yMin, yMax]);

        const xAxis = d3.axisBottom(x).tickSize(-height);
        const yAxis = d3.axisLeft(y).tickSize(-width);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // @ts-ignore
        const tooltip = d3tip()
            .attr("class", "d3-tip")
            .offset([-10, 0])
            .html((d: any) => xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat]);

        const svg = d3.select(element)
            .append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
            .append("g")
            .attr("transform", "translate(20, 0)");

        svg.call(tooltip);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .classed("label", true)
            .attr("x", width)
            .attr("y", margin.bottom - 10)
            .style("text-anchor", "end")
            .text(xCat);

        svg.append("g")
            .classed("y axis", true)
            .call(yAxis)
            .append("text")
            .classed("label", true)
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yCat);

        const objects = svg.append("svg")
            .classed("objects", true)
            .attr("width", width)
            .attr("height", height);

        objects.append("svg:line")
            .classed("axisLine hAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + height + ")");

        objects.append("svg:line")
            .classed("axisLine vAxisLine", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height);

        objects.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .classed("dot", true)
            .attr("r", (d: any) => 6 * Math.sqrt(d[rCat] / Math.PI))
            .attr("transform", (d) => "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")")
            .style("fill", (d: any) => color(d[colorCat]))
            .on("mouseover", tooltip.show)
            .on("mouseout", tooltip.hide);

        const legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .classed("legend", true)
            .attr("transform", (d, i) => "translate(" + (i * 75) + ", " + (height + 20) + ")");

        legend.append("circle")
            .attr("r", 3.5)
            .attr("cx", 20)
            .attr("fill", color);

        legend.append("text")
            .attr("x", 26)
            .attr("dy", ".35em")
            .text((d) => d);
    }

}
