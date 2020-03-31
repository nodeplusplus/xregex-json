import faker from "faker";
import flattern from "flat";

import { ParseSeperators } from "../../src/types/XJSON";
import { SEPERATOR_SEGMENT, SEPERATOR_KEY_VALUE } from "../../src/constants";
import { stringify } from "../../src/stringify";

const seperators: Required<ParseSeperators> = { segment: "#", keyValue: "~" };

describe("stringify", () => {
  const object = {
    name: faker.lorem.words(),
    childs: [
      {
        id: faker.random.uuid(),
        createdAt: faker.date.recent(),
      },
      {
        id: faker.random.uuid(),
        createdAt: faker.date.recent(),
        comments: faker.random.number(),
        isActive: faker.random.boolean(),
      },
      {
        id: faker.random.uuid(),
        createdAt: faker.date.recent(),
        isActive: faker.random.boolean(),
      },
    ],
    comments: faker.random.number(),
    isActive: faker.random.boolean(),
  };

  it("should return empty string if data is not truthy", () => {
    expect(stringify(undefined as any)).toBe("");
    expect(stringify(null as any)).toBe("");
    expect(stringify("")).toBe("");
  });

  it("should return empty string if data is not truthy array of object", () => {
    expect(stringify([])).toBe("");
    expect(stringify({})).toBe("");
  });

  it("should return string successfully", () => {
    const segments = stringify(object).split(SEPERATOR_SEGMENT);

    const totalSegments =
      Object.keys(object).length -
      1 +
      Object.keys(flattern(object.childs)).length;
    expect(segments.length).toBe(totalSegments);
  });

  it("should stringify with custom seperators", () => {
    const segments = stringify(object, seperators).split(seperators.segment);

    const totalSegments =
      Object.keys(object).length -
      1 +
      Object.keys(flattern(object.childs)).length;
    expect(segments.length).toBe(totalSegments);
  });
});
