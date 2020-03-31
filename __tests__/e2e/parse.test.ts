import faker from "faker";
import flattern from "flat";

import { ParseSeperators } from "../../src/types/XJSON";
import { SEPERATOR_SEGMENT, SEPERATOR_KEY_VALUE } from "../../src/constants";
import { parse, parseSegment } from "../../src/parse";

const seperators: Required<ParseSeperators> = { segment: "#", keyValue: "~" };

describe("parseSegment", () => {
  it("should return null if data is not truthy string", () => {
    expect(parseSegment(undefined as any)).toBeNull();
    expect(parseSegment(null as any)).toBeNull();
    expect(parseSegment("")).toBeNull();
  });

  it("should return null if data is not contained seperator", () => {
    expect(parseSegment(" ")).toBeNull();
    // Using default seperator
    expect(parseSegment(`a${seperators.keyValue}1`)).toBeNull();
    // Using custom seperator
    expect(
      parseSegment(`a${SEPERATOR_KEY_VALUE}1`, seperators.keyValue)
    ).toBeNull();
  });

  it("should resolve number as well", () => {
    const key = faker.lorem.word();
    const value = faker.random.number();
    const data = [key, value].join(SEPERATOR_KEY_VALUE);

    expect(parseSegment(data)).toEqual({ [key]: value });
  });

  it("should resolve boolean as well", () => {
    const key = faker.lorem.word();
    const value = faker.random.boolean();
    const data = [key, value].join(SEPERATOR_KEY_VALUE);

    expect(parseSegment(data)).toEqual({ [key]: value });
  });

  it("should resolve ISO date string as well", () => {
    const key = faker.lorem.word();
    const value = faker.date.recent();
    const data = [key, value.toISOString()].join(SEPERATOR_KEY_VALUE);

    expect(parseSegment(data)).toEqual({ [key]: value });
  });

  it("should return raw string for other case", () => {
    const key = faker.lorem.word();
    const now = new Date().toString();

    expect(parseSegment([key, "a"].join(SEPERATOR_KEY_VALUE))).toEqual({
      [key]: "a",
    });
    expect(parseSegment([key, "True"].join(SEPERATOR_KEY_VALUE))).toEqual({
      [key]: "True",
    });
    expect(parseSegment([key, now].join(SEPERATOR_KEY_VALUE))).toEqual({
      [key]: now,
    });
  });
});

describe("parse", () => {
  const object = {
    name: faker.lorem.words(),
    childs: [
      {
        id: faker.random.uuid(),
        createdAt: faker.date.recent(),
      },
    ],
  };

  it("should return null if data is not truthy string", () => {
    expect(parse(undefined as any)).toBeNull();
    expect(parse(null as any)).toBeNull();
    expect(parse("")).toBeNull();
  });

  it("should return object successfully", () => {
    const flatObject = flattern<any, any>(object);
    const data = Object.keys(flatObject)
      .map((key) => {
        let value = flatObject[key];
        if (value instanceof Date) value = value.toISOString();
        return `${key}${SEPERATOR_KEY_VALUE}${value}`;
      })
      .join(SEPERATOR_SEGMENT);

    expect(parse(data)).toEqual(object);
  });

  it("should parse with custom seperators", () => {
    const flatObject = flattern<any, any>(object);
    const data = Object.keys(flatObject)
      .map((key) => {
        let value = flatObject[key];
        if (value instanceof Date) value = value.toISOString();
        return `${key}${seperators.keyValue}${value}`;
      })
      .join(seperators.segment);

    expect(parse(data, seperators)).toEqual(object);
  });
});
