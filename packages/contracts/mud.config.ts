import { mudConfig } from "@latticexyz/world/register";

export default mudConfig({
  namespace: "testing",
  name: "test",
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
    Grid2DSystem: {
      name : "Grid2DSystem",
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
    Grid2D: {
      keySchema: {
        x: "uint32",
        y: "uint32",
      },
      schema: {
        isOccupied: "bool",
        data: "bytes",
        author: "address",
      }
    },
    Grid2DTags: {
      keySchema: {
        x: "uint32",
        y: "uint32",
      },
      schema: {
        tags: "uint32",
        taggers: "address[]",
      }
    },
    Grid2DTagger: {
      keySchema: {
        tagger: "address",
      },
      schema: {
        tagX: "uint32[]",
        tagY: "uint32[]",
        timestamp: "uint128[]",
      }
    },
    GridConstants: {
      keySchema: {},
      schema: {
        width: "uint32",
        height: "uint32",
      }
    },
  },

});
