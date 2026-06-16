import { TextField } from "@/components/ui";

import { maskDob } from "../lib/dob";

type DateOfBirthFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
};

/**
 * Formats DOB input as MM/DD/YYYY.
 * Validation is handled by the parent screen.
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
