/**
 * Date-of-birth input helpers. Kept as pure functions so masking and the age gate can be
 * unit-reasoned in isolation and reused if DOB is collected elsewhere later.
 */

/** Minimum age to create an account (dating product → 18+). */
export const MIN_AGE = 18;

/**
 * Formats raw keystrokes into `MM/DD/YYYY`. Slashes are derived from the digit count, so the
 * caller can feed back the masked value on every change without fighting the separators. We
 * insert a slash only after a segment is complete (`>` not `>=`) to keep backspace working.
 */
export function maskDob(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 8);
  let result = digits.slice(0, 2);
  if (digits.length > 2) result += `/${digits.slice(2, 4)}`;
  if (digits.length > 4) result += `/${digits.slice(4, 8)}`;
  return result;
}

export type DobValidity = {
  /** All eight digits have been entered. */
  isComplete: boolean;
  /** A real calendar date and old enough to sign up. */
  isValid: boolean;
  age: number | null;
};

/** Validates a masked DOB string: real calendar date and at least `MIN_AGE` years old. */
export function validateDob(value: string): DobValidity {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) {
    return { isComplete: false, isValid: false, age: null };
  }

  const month = Number(digits.slice(0, 2));
  const day = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);

  // Date rolls invalid components over (e.g. Feb 30 → Mar 2), so round-trip to reject them.
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!isRealDate) {
    return { isComplete: true, isValid: false, age: null };
  }

  const age = getAge(date);
  return { isComplete: true, isValid: age >= MIN_AGE, age };
}

function getAge(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}
