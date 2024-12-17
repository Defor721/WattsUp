declare module "react-plotly.js" {
  import * as React from "react";

  export interface PlotParams {
    data: Partial<Plotly.Data>[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    style?: React.CSSProperties;
    className?: string;
    onInitialized?: (
      figure: Readonly<PlotParams>,
      graphDiv: HTMLElement,
    ) => void;
    onUpdate?: (figure: Readonly<PlotParams>, graphDiv: HTMLElement) => void;
    onPurge?: (figure: Readonly<PlotParams>, graphDiv: HTMLElement) => void;
    divId?: string;
    revision?: number;
    useResizeHandler?: boolean;
  }

  const Plot: React.FC<PlotParams>;

  export default Plot;
}
