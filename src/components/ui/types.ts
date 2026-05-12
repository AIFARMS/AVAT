import type * as React from "react";

export type UIProps<T extends React.ElementType = "div"> = {
  className?: string;
  children?: React.ReactNode;
  variant?: any;
  size?: any;
  orientation?: any;
  align?: any;
  sideOffset?: any;
  inset?: any;
  checked?: any;
  asChild?: boolean;
  showCloseButton?: boolean;
  decorative?: boolean;
  errors?: Array<{ message?: React.ReactNode }>;
  [key: string]: any;
};
