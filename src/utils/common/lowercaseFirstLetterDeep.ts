export const lowercaseFirstLetterDeep = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(lowercaseFirstLetterDeep);
  }

  if (value && typeof value === "object" && value.constructor === Object) {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      result[newKey] = lowercaseFirstLetterDeep(val);
    }
    return result;
  }

  // primitives, dates, functions, etc.
  return value;
}