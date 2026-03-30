type Props = { title: string; desc: string; icon?: React.ReactNode };
export function FeatureCard({ title, desc, icon }: Props) {
  return (
    <div className="card p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        {icon && <div className="text-[--color-vice-teal]">{icon}</div>}
        <h3 className="text-xl font-semibold sm:text-2xl">{title}</h3>
      </div>
      <p className="mt-3 text-base text-muted-foreground sm:text-lg">{desc}</p>
    </div>
  );
}
