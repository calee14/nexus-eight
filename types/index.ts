// types/index
import { z } from 'zod';

export interface SmartRow {
  ticker: string;
  peg?: SmartCell;
  growth?: SmartCell;
  fcf?: SmartCell;
  pe?: SmartCell;
  ps?: SmartCell;
}

export type SmartCell = (string | number)[][] | undefined;

export interface SmartColumn {
  headers: string[];
  keys: (keyof SmartRow)[];
}


const SmartRowSchema = z.object({
  ticker: z.string(),
  peg: z.array(z.array(z.union([z.string(), z.number()]))).optional(),
  growth: z.array(z.array(z.union([z.string(), z.number()]))).optional(),
  fcf: z.array(z.array(z.union([z.string(), z.number()]))).optional(),
  ps: z.array(z.array(z.union([z.string(), z.number()]))).optional(),
});

export const isSmartRow = (obj: unknown): obj is SmartRow =>
  SmartRowSchema.safeParse(obj).success;

const SmartCellSchema = z.array(z.array(z.union([z.string(), z.number()]))).optional();
export const isSmartCell = (obj: unknown): obj is SmartCell =>
  SmartCellSchema.safeParse(obj).success;



