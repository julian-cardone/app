/**
 * Pure DOB helpers for masking and age validation.
 */

/** Minimum age required to create an account. */
export const MIN_AGE = 18;

const NON_DIGIT_PATTERN = /\D/g;
const DOB_DIGIT_LENGTH = 8;
const MONTH_END_INDEX = 2;
const DAY_END_INDEX = 4;

/**
 * Formats raw input as MM/DD/YYYY while preserving backspace behavior.
 */
export function maskDob(input: string): string {
  const digits = input.replace(NON_DIGIT_PATTERN, "").slice(0, DOB_DIGIT_LENGTH);

  let result = digits.slice(0, MONTH_END_INDEX);

  if (digits.length > MONTH_END_INDEX) {
    result += `/${digits.slice(MONTH_END_INDEX, DAY_END_INDEX)}`;
  }

  if (digits.length > DAY_END_INDEX) {
    result += `/${digits.slice(DAY_END_INDEX, DOB_DIGIT_LENGTH)}`;
  }

  return result;
}

export type DobValidity = {
  /** All DOB digits have been entered. */
  isComplete: boolean;
  /** Valid calendar date and meets minimum age requirement. */
  isValid: boolean;
  age: number | null;
};

/**
 * Validates a DOB string and calculates age.
 */
export function validateDob(value: string): DobValidity {
  const digits = value.replace(NON_DIGIT_PATTERN, "");

  if (digits.length < DOB_DIGIT_LENGTH) {
    return {
      isComplete: false,
      isValid: false,
      age: null,
    };
  }

  const month = Number(digits.slice(0, MONTH_END_INDEX));
  const day = Number(digits.slice(MONTH_END_INDEX, DAY_END_INDEX));
  const year = Number(digits.slice(DAY_END_INDEX, DOB_DIGIT_LENGTH));

  const date = new Date(year, month - 1, day);

  // JavaScript dates roll invalid values forward (e.g. Feb 30 → Mar 2).
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  if (!isRealDate) {
    return {
      isComplete: true,
      isValid: false,
      age: null,
    };
  }

  const age = getAge(date);

  return {
    isComplete: true,
    isValid: age >= MIN_AGE,
    age,
  };
}

function getAge(birthDate: Date, now = new Date()): number {
  let age = now.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}
