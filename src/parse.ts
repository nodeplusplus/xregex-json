import { unflatten } from "flat";

import { GenericObject, ParseSeperators } from "./types/XJSON";
import { SEPERATOR_SEGMENT, SEPERATOR_KEY_VALUE } from "./constants";

export function parse<T>(data: string, seperators?: ParseSeperators): T | null {
  if (!data || typeof data !== "string") return null;

  const { segment: segmentSeperator, keyValue: keyValueSeperator } = {
    segment: SEPERATOR_SEGMENT,
    keyValue: SEPERATOR_KEY_VALUE,
    ...seperators,
  };

  const segments = data
    .split(segmentSeperator)
    .map((segment) => parseSegment(segment, keyValueSeperator))
    .filter(Boolean);
  return unflatten(Object.assign({}, ...segments), { object: false });
}

export function parseSegment(
  data: string,
  seperator = SEPERATOR_KEY_VALUE
): GenericObject | null {
  if (!data || typeof data !== "string") return null;
  data = data.trim();

  const firstSeperator = data.indexOf(seperator);
  // Key must be defined, so index of seperator cannot be 0
  if (firstSeperator <= 0) return null;

  const field = data.slice(0, firstSeperator);
  const value = data.slice(firstSeperator + 1, data.length);

  // Number
  if (Number.isFinite(Number(value))) return { [field]: Number(value) };
  // Boolean
  if (["true", "false"].includes(value)) {
    return { [field]: value === "true" };
  }
  // Datetime
  const ISO_REGEX = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/;
  if (ISO_REGEX.test(value)) return { [field]: new Date(value) };
  // Other case
  return { [field]: value };
}
