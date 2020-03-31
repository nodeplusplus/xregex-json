import { XJSON } from "./types/XJSON";
import { parse } from "./parse";
import { stringify } from "./stringify";

const xJSON: XJSON = { parse, stringify };
export default xJSON;
