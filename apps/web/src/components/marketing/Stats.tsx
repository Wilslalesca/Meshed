export function Stats() {
  const items = [
    { k: "10+", v: "Sports supported" },
    { k: "99.9%", v: "Uptime target" },
    { k: "Minutes", v: "to onboard a team" },
  ];
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.v}
              className="card p-5 text-center border border-[--color-vice-teal]/30"
            >
              <div className="text-2xl font-extrabold text-[--color-vice-teal]">
                {it.k}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{it.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
