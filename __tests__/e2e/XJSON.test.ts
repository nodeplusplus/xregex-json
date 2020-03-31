import faker from "faker";

import XJSON from "../../src/XJSON";

describe("XJSON", () => {
  const data = {
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

  it("should transform data by XJSON.stringify and XJSON.parse smoothy", () => {
    const string = XJSON.stringify(data);
    const object = XJSON.parse(string);

    expect(object).toStrictEqual(data);
  });
});
