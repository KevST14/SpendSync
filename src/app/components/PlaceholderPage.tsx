interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-8">
      <header className="header rounded-lg bg-surface p-6 shadow-lg">
        <h1 className="text-3xl font-semibold text-primary">{title}</h1>
      </header>
      <section className="space-y-2 rounded-lg bg-surface p-10 text-center shadow-md">
        <p className="text-lg">{description}</p>
        <p className="text-sm text-secondary">
          This section is coming in a later phase of the rework.
        </p>
      </section>
    </div>
  );
}
