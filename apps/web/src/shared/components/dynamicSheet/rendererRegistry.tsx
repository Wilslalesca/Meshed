import * as React from "react";
import { Field } from "@/shared/components/forms/Field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/utils/utils";

import type { FieldSchema } from "@/shared/types/dynamicSheet";

export type RenderCtx = {
  field: FieldSchema;
  value: unknown;
  error?: string;
  setValue: (v: unknown) => void;
};

type Renderer = (ctx: RenderCtx) => React.ReactNode;

export const rendererRegistry: Record<FieldSchema["kind"], Renderer> = {
  input: ({ field, value, error, setValue }) => {
    if (field.kind !== "input") return null;
    return (
      <Field label={field.label} hint={field.hint} error={error}>
        <Input
          disabled={field.disabled}
          placeholder={field.placeholder}
          value={(value ?? "") as string}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
    );
  },

  textarea: ({ field, value, error, setValue }) => {
    if (field.kind !== "textarea") return null;
    return (
      <Field label={field.label} hint={field.hint} error={error}>
        <Textarea
          disabled={field.disabled}
          placeholder={field.placeholder}
          rows={field.rows ?? 4}
          value={(value ?? "") as string}
          onChange={(e) => setValue(e.target.value)}
        />
      </Field>
    );
  },

  select: ({ field, value, error, setValue }) => {
    if (field.kind !== "select") return null;
    return (
      <Field label={field.label} hint={field.hint} error={error}>
        <Select
          disabled={field.disabled}
          value={(value ?? "") as string}
          onValueChange={(v) => setValue(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  },

  checkbox: ({ field, value, error, setValue }) => {
    if (field.kind !== "checkbox") return null;
    return (
      <Field label={field.label} hint={field.hint} error={error}>
        <div className="flex items-center gap-2">
          <Checkbox
            disabled={field.disabled}
            checked={Boolean(value)}
            onCheckedChange={(v: any) => setValue(Boolean(v))}
          />
          <span className="text-sm text-muted-foreground">Enabled</span>
        </div>
      </Field>
    );
  },

  switch: ({ field, value, error, setValue }) => {
    if (field.kind !== "switch") return null;
    return (
      <Field label={field.label} hint={field.hint} error={error}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Off / On</span>
          <Switch
            disabled={field.disabled}
            checked={Boolean(value)}
            onCheckedChange={(v) => setValue(Boolean(v))}
          />
        </div>
      </Field>
    );
  },

  date: ({ field, value, error, setValue }) => {
    if (field.kind !== "date") return null;

    const date = value instanceof Date ? value : undefined;

    return (
      <Field label={field.label} hint={field.hint} error={error}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={field.disabled}
              variant="outline"
              className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : (field.placeholder ?? "Pick a date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => setValue(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </Field>
    );
  },
  // TODO FINSIH
  radio: () => null,
  slider: () => null,
  combobox: () => null,
  toggle: () => null,
  toggleGroup: () => null,
};
