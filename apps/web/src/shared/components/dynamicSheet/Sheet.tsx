"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";

import type { SheetSchema } from "@/shared/types/dynamicSheet";
import type { Errors, Values } from "./types";
import { rendererRegistry } from "./rendererRegistry";

export function DynamicCrudSheet({
  trigger,
  schema,
  initialValues,
  onSubmit,
}: {
  trigger: React.ReactNode;
  schema: SheetSchema;
  initialValues?: Values; 
  onSubmit: (values: Values) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<Values>({});
  const [errors] = React.useState<Errors>({}); 

  React.useEffect(() => {
    if (open) setValues(initialValues ?? {});
  }, [open, initialValues]);

  const progress =
    schema.fields.length === 0
      ? 0
      : Math.round(
          (schema.fields.filter((f) => values[f.key] !== undefined && values[f.key] !== "").length /
            schema.fields.length) *
            100
        );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{schema.title}</SheetTitle>
          {schema.subtitle ? <SheetDescription>{schema.subtitle}</SheetDescription> : null}
        </SheetHeader>

        {schema.showProgress ? <Progress className="mt-4" value={progress} /> : null}

        <div className="mt-6 grid gap-4">
          {schema.fields.map((field) => {
            const render = rendererRegistry[field.kind];
            const value = values[field.key];
            const setValue = (v: unknown) =>
              setValues((prev) => ({ ...prev, [field.key]: v }));

            return (
              <React.Fragment key={field.key}>
                {render({ field, value, error: errors[field.key], setValue })}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit(values);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
