import { TextField } from "@/components/ui";

import { maskDob } from "../lib/dob";

type DateOfBirthFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
};

/**
 * Onboarding DOB entry. A masked text field beats a date picker for speed here: typing a
 * birth year is far faster than scrolling decades. The screen owns validation; this component
 * only enforces the `MM/DD/YYYY` shape as the user types.
 */
export function DateOfBirthField({ value, onChangeText, error }: DateOfBirthFieldProps) {
  const handleChange = (raw: string) => onChangeText(maskDob(raw));

  return (
    <TextField
      label="Date of birth"
      value={value}
      onChangeText={handleChange}
      error={error}
      placeholder="MM/DD/YYYY"
      keyboardType="number-pad"
      maxLength={10}
      returnKeyType="done"
    />
  );
}
