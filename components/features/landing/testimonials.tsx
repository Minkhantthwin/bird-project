const quotes = [
  {
    text: 'attanDANCE changed my life. I went from dancing alone in my room to performing on stage with an incredible crew.',
    author: 'Riko Sato',
    role: 'Member since 2024',
  },
  {
    text: 'The energy in this community is unmatched. Every session pushes me to be a better dancer and a better person.',
    author: 'Jihoon Kim',
    role: 'Member since 2024',
  },
  {
    text: 'As an instructor, seeing students grow from beginners to performers is the most rewarding feeling.',
    author: 'Kai Yamamoto',
    role: 'Instructor',
  },
];

export function Testimonials() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            What our <span className="text-primary">crew</span> says
          </h2>
          <p className="text-muted-foreground">
            Real stories from real dancers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <div
              key={q.author}
              className="animate-fade-up rounded-3xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm hover:border-primary/10 hover:shadow-md transition-all duration-300 ease-out"
              style={{ animationDelay: `${(i + 1) * 150}ms` }}
            >
              <p className="text-sm leading-relaxed text-muted-foreground italic">
                &ldquo;{q.text}&rdquo;
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold">{q.author}</p>
                <p className="text-xs text-muted-foreground">{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
