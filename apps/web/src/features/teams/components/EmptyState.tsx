interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const EmptyState = ({ title, description, children }: Props) => {
  return (
    <div className="border rounded-md p-8 text-center space-y-2 text-muted-foreground">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};
