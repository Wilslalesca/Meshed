import * as React from "react";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/utils";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <Label>{label}</Label>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>

      {children}

      {error ? <p className={cn("text-sm text-destructive")}>{error}</p> : null}
    </div>
  );
}

export function FieldGroup({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4">
      {title ? (
        <div className="grid gap-1">
          <div className="font-medium">{title}</div>
          {description ? (
            <div className="text-sm text-muted-foreground">{description}</div>
          ) : null}
        </div>
      ) : null}
      <div className="grid gap-4">{children}</div>
    </div>
  );
}
