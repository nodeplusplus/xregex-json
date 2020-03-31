export interface GenericObject {
  [name: string]: any;
}

export interface ParseSeperators {
  segment?: string;
  keyValue?: string;
}

export interface XJSON {
  parse<T>(data: string, seperators?: ParseSeperators): T | null;
  stringify(data: any, seperators?: ParseSeperators): string;
}
