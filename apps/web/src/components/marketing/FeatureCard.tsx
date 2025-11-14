type Props = { title: string; desc: string; icon?: React.ReactNode };
export function FeatureCard({ title, desc, icon }: Props) {
  return (
    <div className="card p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        {icon && <div className="text-[--color-vice-teal]">{icon}</div>}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
