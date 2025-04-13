import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { SlottableTextProps, TextRef } from "@rn-primitives/types";
import * as React from "react";

const H1 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-4xl font-bold tracking-tight", className)}
      {...props}
    />
  )
);

const H2 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-3xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
);

const H3 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
);

const H4 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
);

const H5 = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text
      ref={ref}
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  )
);

// Base Typography component that inherits from Text
const BaseText = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} className={cn("text-base", className)} {...props} />
  )
);

H1.displayName = "Typography.H1";
H2.displayName = "Typography.H2";
H3.displayName = "Typography.H3";
H4.displayName = "Typography.H4";
H5.displayName = "Typography.H5";
BaseText.displayName = "Typography.Text";

export const Typography = {
  H1,
  H2,
  H3,
  H4,
  H5,
  Text: BaseText,
};
