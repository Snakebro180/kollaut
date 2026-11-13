// Big page title used at the top of inner pages.
export default function PageHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <header className="pt-16 pb-2 sm:pt-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>
      {text && (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-snow/60">
          {text}
        </p>
      )}
    </header>
  );
}
