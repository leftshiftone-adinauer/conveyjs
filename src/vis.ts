import {Heatmap} from './lib/renderable/vis/heatmap/Heatmap';
import {Sunburst} from './lib/renderable/vis/sunburst/Sunburst';
import {Sankey} from './lib/renderable/vis/sankey/Sankey';
import Scatterplot from './lib/renderable/vis/scatterplot/Scatterplot';
import Stackedbar from './lib/renderable/vis/stackedbar/Stackedbar';
import HeatmapOptions from './lib/renderable/vis/heatmap/HeatmapOptions';
import SunburstOptions from './lib/renderable/vis/sunburst/SunburstOptions';
import SankeyOptions from './lib/renderable/vis/sankey/SankeyOptions';
import ScatterplotOptions from './lib/renderable/vis/scatterplot/ScatterplotOptions';
import StackedbarOptions from './lib/renderable/vis/stackedbar/StackedbarOptions';
import {Doughnut} from './lib/renderable/vis/doughnut/Doughnut';
import DoughnutOptions from './lib/renderable/vis/doughnut/DoughnutOptions';
import {Line} from './lib/renderable/vis/line/Line';
import LineOptions from './lib/renderable/vis/line/LineOptions';
import {Bar} from './lib/renderable/vis/bar/Bar';
import BarOptions from './lib/renderable/vis/bar/BarOptions';
import {Graph} from './lib/renderable/vis/graph/Graph';
import GraphOptions from './lib/renderable/vis/graph/GraphOptions';
import {Bar3D} from './lib/renderable/vis/bar3d/Bar3D';
import Bar3DOptions from './lib/renderable/vis/bar3d/Bar3DOptions';

// check environment (nextjs)
if (typeof document !== "undefined") {
    require("./lib/renderable/vis/bar3d/Bar3D.scss");
    require("./lib/renderable/vis/doughnut/Doughnut.scss");
    require("./lib/renderable/vis/heatmap/Heatmap.scss");
    require("./lib/renderable/vis/line/Line.scss");
    require("./lib/renderable/vis/scatterplot/Scatterplot.scss");
    require("./lib/renderable/vis/stackedbar/Stackedbar.scss");
    require("./lib/renderable/vis/sunburst/Sunburst.scss");
}

export {
    Heatmap,
    HeatmapOptions,
    Sunburst,
    SunburstOptions,
    Sankey,
    SankeyOptions,
    Scatterplot,
    ScatterplotOptions,
    Stackedbar,
    StackedbarOptions,
    Doughnut,
    DoughnutOptions,
    Line,
    LineOptions,
    Bar,
    BarOptions,
    Graph,
    GraphOptions,
    Bar3D,
    Bar3DOptions
};
