const features = [
  {
    icon: '🕺',
    title: '12+ Dance Styles',
    description:
      'From Hip-Hop to Contemporary, Ballet to Afrobeat — explore a diverse range of styles taught by expert instructors.',
  },
  {
    icon: '🎪',
    title: 'Monthly Battles',
    description:
      'Showcase your skills in friendly competitions. Monthly battles push your limits and build confidence.',
  },
  {
    icon: '💬',
    title: 'Social Feed',
    description:
      'Connect with fellow dancers. Share videos, post updates, comment, and react — all in one place.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{' '}
            <span className="text-primary">grow</span>
          </h2>
          <p className="text-muted-foreground">
            A complete platform for dancers, by dancers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group animate-fade-up rounded-3xl border border-border/50 bg-card/40 p-8 backdrop-blur-sm hover:border-primary/20 hover:bg-card/60 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out"
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
