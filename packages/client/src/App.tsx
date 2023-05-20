//@ts-nocheck
import { useComponentValue, useRow, useEntityQuery, useTable } from "@latticexyz/react";
import { Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { stringToBytes16, stringToBytes32, awaitStreamValue } from "@latticexyz/utils";
import { encodeSchema, SchemaType } from "@latticexyz/schema-type";
import { useMUD } from "./MUDContext";
import { useState, useEffect } from "react";
import { resolveTableId } from "@latticexyz/config";
import "./App.css";

export const App = () => {
  const {
    components: { Counter, TestData, TestKeyedData, Grid2D },
    systemCalls: {
      increment,
      incrementSquared,
      pushRecordToTestData,
      pushRecordToTestKeyedData,
      setGridLimit,
      setGridPointData,
    },
    network: { singletonEntity, storeCache, worldSend, worldContract, txReduced$ },
  } = useMUD();
  const [recordId, setRecordId] = useState(0);
  const [stringInput, setStringInput] = useState("");
  const [tableId, setTableId] = useState("");
  const [gridLimitVal, setGridLimitVal] = useState(5);

  const [grid, setGrid] = useState(null);

  useEffect(() => {
    updateGridSize();
  }, []);

  //===================================================================================================
  // ACCESSING TABLES
  //===================================================================================================

  // Access components either via ECS or via useRow as shown in the livestream
  // ECS queries can find by value, useRow can also find by key

  const counter = useComponentValue(Counter, singletonEntity);
  console.log("counter", counter);

  const testData = useComponentValue(TestData, singletonEntity);

  const counter2 = useRow(storeCache, { table: "Counter", key: {} });
  console.log(counter2);

  const matchingEntities = useEntityQuery([Has(TestKeyedData)]);
  console.log("entities", matchingEntities[0]);

  const matchingEntities2 = useEntityQuery([
    Has(TestKeyedData),
    HasValue(TestKeyedData, { testUint32: Number(recordId) }),
  ]);
  console.log("recordId", recordId);
  console.log("typeof recordId", typeof recordId);
  console.log("entities2", matchingEntities2);

  const tableInstances = matchingEntities.map((testEntity) => getComponentValueStrict(TestKeyedData, testEntity));
  console.log("tableInstance", tableInstances);
  // console.log("tableInstances[1].testUint32", tableInstances[0].testUint32);

  //get table row by key (id)

  const testKeyedData2 = useRow(storeCache, { table: "TestKeyedData", key: { id: Number(recordId) } });
  console.log("testKeyedData2", testKeyedData2);
  console.log("testKeyedData2.testUint32", testKeyedData2?.value?.testUint32);

  //===================================================================================================
  // GET/SET GRID DATA
  //===================================================================================================

  const gridData = useEntityQuery([Has(Grid2D), HasValue(Grid2D, { isOccupied: true })]);
  console.log("gridData, isOccupied=true", gridData);

  const updateGridSize = () => {
    const thisGrid = createGrid({ size: gridLimitVal });
    setGrid(thisGrid);
  };

  function createGrid({ size }) {
    const grid = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(<div key={`${i}-${j}`} className="grid-cell"></div>);
      }
      grid.push(
        <div key={i} className="grid-row">
          {row}
        </div>
      );
    }
    return <div className="grid">{grid}</div>;
  }

  //===================================================================================================
  // FUNCTIONS TO CREATE NEW TABLES / SCHEMAS
  //===================================================================================================

  const defineKeys = () => {};
  const defineVaules = () => {};

  const namespace = "0x00"; //stringToBytes16(stringInput);
  console.log("world", worldContract.address);
  console.log("namespace", namespace);
  const tableName = stringToBytes16(stringInput);
  const tableNameBytes32 = stringToBytes32(stringInput);

  //checking schema types for adding them in UI dynamically
  console.log("schemeType uint256", SchemaType.UINT256); //31
  console.log("schemeType bytes32", SchemaType.BYTES32); //95

  //TS Call: https://github.com/latticexyz/mud/blob/641d0d35912622c99fcbb347b0c0af15efc0ad11/examples/minimal/packages/contracts/types/ethers-contracts/IWorld.ts#LL975C1-L990C37
  //Sol Function Def: https://github.com/latticexyz/mud/blob/641d0d35912622c99fcbb347b0c0af15efc0ad11/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L52
  // working example of creating a table
  // registers namespace if not already registered
  // can NOT write to ROOT_NAME namespace
  // no resources at this selector yet (resources are namespaces, tables, and systems)
  //
  const createTable = async () => {
    const registerTableTxn = await worldSend("registerTable", [
      namespace, //namespace
      tableName, //tableName
      encodeSchema([SchemaType.UINT256]), //value schema
      encodeSchema([SchemaType.BYTES32]), //key schema
    ]);
    const streamVal = await awaitStreamValue(txReduced$, (txHash) => txHash === registerTableTxn.hash);
    setTableId(streamVal);
    console.log("resolveTableId(stringInput)", resolveTableId(stringInput));
    console.log("streamVal", streamVal);
  };

  //not working yet
  const createFieldInTable = async () => {
    await worldSend("setField", [
      namespace, //namespace
      tableName, //tableName
      [stringToBytes32("")], //key
      "hello", //schemaIndex
    ]);
  };

  const getTable = async () => {
    const table = await worldSend("get", [worldContract.address, tableId]);
    // const table2 = await worldSend("get", [worldContract.address, tableName]);
    console.log("table", table);
    // console.log("table2", table2);
  };

  //not working yet
  const createRecordInTable = async () => {
    await worldSend("setRecord", [
      namespace, //namespace
      tableName, //tableName
      0, // [stringToBytes32("abcd")],
      //bytes
    ]);
  };

  const getTableSchema = async () => {
    const schema = await worldSend("getSchema", ["0xc1a8cca06055494ab6f0ab5fe5adc8fdf1d2e69e19834513d092b409fe69cff1"]);
    const schema2 = await worldSend("getSchema", [tableNameBytes32]);

    console.log("schema", schema);
    console.log("schema2", schema2);
  };

  //===================================================================================================
  // UI
  //===================================================================================================

  return (
    <>
      <div>
        Counter: <span>{counter?.counterValue ?? "??"}</span>
        <p>
          Counter2: <span>{counter2?.value.counterValue ?? "??"}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button>

      <div>
        Counter: <span>{counter?.counterValueSquared ?? "??"}</span>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await incrementSquared());
        }}
      >
        Increment
      </button>

      <div>
        <p>
          TestData testUint32: <span>{testData?.testUint32 ?? "??"}</span>
        </p>
        <p>
          TestData testBytes32: <span>{testData?.testBytes32 ?? "??"}</span>
        </p>
        <p>
          TestData testString: <span>{testData?.testString ?? "??"}</span>
        </p>
        <p>
          TestData testUint32Array: <span>{testData?.testUint32Array[0] ?? "??"}</span>,{" "}
          <span>{testData?.testUint32Array[1] ?? "??"}</span>, <span>{testData?.testUint32Array[2] ?? "??"}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log("testData record testUint32:", await pushRecordToTestData());
        }}
      >
        Push Record
      </button>

      <p>
        {/* get data from testKeyedData of key recordId */}
        TestKeyedData testUint32: <span>{testKeyedData2?.value?.testUint32 ?? "??" ?? "??"}</span>
      </p>
      <p>
        TestKeyedData testBytes32: <span>{testKeyedData2?.value?.testBytes32 ?? "??"}</span>
      </p>
      <div>
        <input
          onChange={(event) => {
            event.preventDefault();
            setRecordId(event.target.value);
          }}
        />
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          await pushRecordToTestKeyedData(recordId);
        }}
      >
        Push Record by Key ID
      </button>

      <div>
        <input
          onChange={(event) => {
            event.preventDefault();
            setStringInput(event.target.value);
          }}
        />
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            await createTable();
          }}
        >
          createTable
        </button>
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            await createFieldInTable();
          }}
        >
          createFieldInTable
        </button>
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            await createRecordInTable();
          }}
        >
          createRecordInTable
        </button>
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            console.log(getTableSchema());
          }}
        >
          getTableSchema
        </button>
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            console.log(getTable());
          }}
        >
          getTable
        </button>
      </div>
      <div>
        <h1>Grid Examples</h1>
        <div>
          <h2>Set Limits</h2>
          <input
            onChange={(event) => {
              event.preventDefault();
              setGridLimitVal(event.target.value);
            }}
          />
          <button
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              setGridLimit(gridLimitVal, gridLimitVal);
              updateGridSize();
            }}
          >
            Set Square Grid Side Length
          </button>
        </div>
        <div>
          <h2>Grid</h2>
          <div>{grid}</div>
        </div>
      </div>
    </>
  );
};
