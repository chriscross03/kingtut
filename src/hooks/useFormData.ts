import { useState, useCallback } from "react";

export function useFormData<
  T extends Record<string, any> = Record<string, any>
>(initial: T = {} as T) {
  const [formData, setFormData] = useState<T>(initial);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return [formData, setFormData, handleInputChange] as const;
}
