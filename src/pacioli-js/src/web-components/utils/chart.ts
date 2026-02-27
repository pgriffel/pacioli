import type { DimNum } from "uom-ts";

export type ChartEventDetail<Options> = {
  number: DimNum;
  label: string;
  options: Partial<Options>;
};

export type ChartEvent<Options> = CustomEvent<{
  number: DimNum;
  label: string;
  options: Options;
}>;
