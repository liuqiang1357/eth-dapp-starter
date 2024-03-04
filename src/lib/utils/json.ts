export type Json = null | boolean | number | string | Json[] | { [prop: string]: Json };

export function serialize(json: Json): string {
  if (typeof json === 'string') {
    try {
      JSON.parse(json);
    } catch {
      return json;
    }
  }
  return JSON.stringify(json);
}

export function deserialize(string: string): Json {
  try {
    return JSON.parse(string);
  } catch {
    return string;
  }
}
