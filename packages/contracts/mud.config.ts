import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "Test1",
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
        testUint32: "uint32",
        testBytes32: "bytes32",
        testString: "string",
        testUint32Array: "uint32[]",
      }
    },
    TestKeyedData: {
      keySchema: {
        id: "uint32",
      },
      schema: {
        testUint32: "uint32",
        testBytes32: "bytes32",
      }
    },
  },
});
