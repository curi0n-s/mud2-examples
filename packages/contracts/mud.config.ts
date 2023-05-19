import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  // namespace: "test",
  // name: "test",
  systems: {
    IncrementSystem: {
      name : "IncrementSystem",
      openAccess: true,
    },
    TestDataSystem: {
      name : "TestDataSystem",
      openAccess: true,
    },
    TestKeyedDataSystem: {
      name : "TKDSystem",
      openAccess: true,
    },
  },
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
