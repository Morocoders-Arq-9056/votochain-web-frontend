type CameraGuideProps = {
  instruction: string;
};

export function CameraGuide({ instruction }: CameraGuideProps) {
  return (
    <div
      className="flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border border-border bg-bg p-6"
      role="img"
      aria-label={instruction}
    >
      <span
        aria-hidden
        className="h-41 w-32 rounded-[50%] border-2 border-dashed border-text-secondary"
      />
      <p className="text-center text-sm text-text-secondary">{instruction}</p>
    </div>
  );
}
