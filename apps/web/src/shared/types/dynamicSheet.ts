export type Option = { label: string; value: string };

export type FieldKind =
  | "input"
  | "textarea"
  | "select"
  | "combobox"
  | "checkbox"
  | "switch"
  | "radio"
  | "slider"
  | "toggle"
  | "toggleGroup"
  | "date";

export type FieldSchema =
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "input";
      placeholder?: string;
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "textarea";
      placeholder?: string;
      disabled?: boolean;
      rows?: number;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "select";
      options: Option[];
      placeholder?: string;
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "radio";
      options: Option[];
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "checkbox";
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "switch";
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "slider";
      min?: number;
      max?: number;
      step?: number;
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "date";
      placeholder?: string;
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "combobox";
      options: Option[];
      placeholder?: string;
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "toggle";
      disabled?: boolean;
    }
  | {
      key: string;
      label: string;
      hint?: string;
      kind: "toggleGroup";
      options: Option[];
      disabled?: boolean;
      multiple?: boolean;
    };

export interface SheetSchema {
  title: string;
  subtitle?: string;
  fields: FieldSchema[];
  showProgress?: boolean;
}
