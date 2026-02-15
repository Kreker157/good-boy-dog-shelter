import { z } from 'zod';

type SetError<T> = (
  name: keyof T,
  error: { type: string; message?: string },
) => void;

export function applyZodErrors<T extends Record<string, unknown>>(
  issues: z.core.$ZodIssue[],
  setError: SetError<T>,
  translate: (key: string) => string,
) {
  for (const issue of issues) {
    const path = issue.path?.[0] as keyof T | undefined;
    if (!path) continue;
    setError(path, { type: 'manual', message: translate(issue.message) });
  }
}
