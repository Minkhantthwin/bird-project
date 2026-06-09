export function AboutSection() {
  return (
    <section id="about" className="bg-muted/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Our <span className="text-primary">Story</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                attanDANCE was born from a simple idea: dance should bring
                people together. What started as a small crew practicing in a
                garage has grown into a thriving community of over 50 dancers
                spanning multiple styles.
              </p>
              <p>
                Our mission is to create a space where dancers of all levels
                can train, connect, and express themselves. Whether you&apos;re
                a seasoned performer or just finding your rhythm, there&apos;s a
                place for you here.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '50+', label: 'Active Members', delay: '0ms' },
              { value: '12', label: 'Dance Styles', delay: '150ms' },
              { value: '8', label: 'Instructors', delay: '300ms' },
              { value: '3', label: 'Years Strong', delay: '450ms' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="animate-scale-in rounded-3xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm text-center hover:scale-105 hover:shadow-md transition-all duration-300 ease-out"
                style={{ animationDelay: stat.delay }}
              >
                <p className="font-heading text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
