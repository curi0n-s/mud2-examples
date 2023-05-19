//@ts-nocheck
import { useComponentValue, useRow, useEntityQuery } from "@latticexyz/react";
import { Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { stringToBytes16 } from "@latticexyz/utils";
import { encodeSchema, SchemaType } from "@latticexyz/schema-type";
import { useMUD } from "./MUDContext";
import { useState } from "react";

export const App = () => {
  const {
    components: { Counter, TestData, TestKeyedData },
    systemCalls: { increment, incrementSquared, pushRecordToTestData, pushRecordToTestKeyedData },
    network: { singletonEntity, storeCache, worldSend },
    world,
  } = useMUD();
  const [recordId, setRecordId] = useState(0);

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
  // FUNCTIONS TO CREATE NEW TABLES / SCHEMAS
  //===================================================================================================

  const defineKeys = () => {};
  const defineVaules = () => {};

  const namespace = stringToBytes16("Test");
  console.log("namespace", namespace);
  const tableName = stringToBytes16("CreatedTable5");

  //checking schema types for adding them in UI dynamically
  console.log("schemeType uint256", SchemaType.UINT256); //31
  console.log("schemeType bytes32", SchemaType.BYTES32); //95

  //https://github.com/latticexyz/mud/blob/641d0d35912622c99fcbb347b0c0af15efc0ad11/examples/minimal/packages/contracts/types/ethers-contracts/IWorld.ts#LL975C1-L990C37
  // working example of creating a table
  const createTable = async () => {
    await worldSend("registerTable", [
      namespace, //namespace
      tableName, //tableName
      encodeSchema([SchemaType.UINT256]), //value schema
      encodeSchema([SchemaType.BYTES32]), //key schema
    ]);
  };

  //not working yet
  const createFieldInTable = async () => {
    await worldSend("setField", [
      namespace, //namespace
      tableName, //tableName
      [stringToBytes16("CreatedKey1")], //key
      0, //schemaIndex
    ]);
  };

  //not working yet
  const createRecordInTable = async () => {
    await worldSend("setRecord", [
      namespace, //namespace
      tableName, //tableName
      [stringToBytes16("abcd")],
      //bytes
    ]);
  };

  const getTableSchema = async () => {
    await worldSend("getSchema", [stringToBytes16(tableName)]);
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
            console.log(await getTableSchema());
          }}
        >
          getTableSchema
        </button>
      </div>
    </>
  );
};
