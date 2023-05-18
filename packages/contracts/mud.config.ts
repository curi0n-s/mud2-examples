import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: {
        counterValue: "uint32",
        counterValueSquared: "uint32",
      }
    },
    TestData: {
      keySchema: {},
      schema: {
        name: "string",
        testUint32: "uint32",
        testUintArray: "uint256[]",
        testBytes32: "bytes32",
      }
    }
  },
});
