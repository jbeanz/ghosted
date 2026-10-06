const PLACEHOLDER = `You: hey! how was your weekend?
Them: it was fine
You: want to grab dinner this week?
Them: maybe, this week is kind of crazy
You: no worries, just lmk
Them: k`;

type PasteBoxProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function PasteBox({ value, onChange, disabled }: PasteBoxProps) {
  return (
    <label className="block">
      <span className="sr-only">Paste your conversation</span>
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={PLACEHOLDER}
        rows={12}
        className="w-full resize-y rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-6 text-ink outline-none placeholder:text-muted/55 focus:border-lavender/50"
      />
    </label>
  );
}
