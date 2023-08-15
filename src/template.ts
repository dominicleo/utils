/**
 * Replace with template.
 *   `I'm ${name}` + { name: 'Leo' } = I'm Leo
 */
export const template = (text: string, variables: Record<string, string>) => {
  return text?.replace(/\$\{\w+\}/g, (value: string) => {
    const key = value.slice(2, -1);
    return variables[key];
  });
};
