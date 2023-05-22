//@ts-nocheck
import {
  useComponentValue,
  useRow,
  useEntityQuery,
  useRows,
} from "@latticexyz/react";
// import { useTables } from "@latticexyz/dev-tools";
import { Has, HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { stringToBytes16, stringToBytes32 } from "@latticexyz/utils";
import { encodeSchema, SchemaType } from "@latticexyz/schema-type";
import { useMUD } from "./MUDContext";
import { useState, useEffect } from "react";
import "./App.css";
import { NetworkEvents } from "@latticexyz/network";

export const App = () => {
  const {
    components: { Counter, TestData, TestKeyedData, Grid2D, GridConstants },
    systemCalls: {
      increment,
      incrementSquared,
      pushRecordToTestData,
      pushRecordToTestKeyedData,
      setGridLimit,
      setGridPointData,
      createNewNamespace,
      createNewTableInNamespace,
      createNewFieldInTable,
      pushValueToField,
      getValueFromField,
    },
    network: {
      singletonEntity,
      storeCache,
      worldSend,
      worldContract,
      txReduced$,
      ecsEvent$,
    },
  } = useMUD();
  const [recordId, setRecordId] = useState(0);
  const [namespaceInput, setNamespaceInput] = useState("");
  const [tableId, setTableId] = useState("");
  const [tableNameInput, setTableNameInput] = useState("");
  const [fieldNameInput, setFieldNameInput] = useState("");
  const [fieldIndexInput, setFieldIndexInput] = useState(0);
  const [pushToFieldInput, setPushToFieldInput] = useState("");
  const [demoDone, setDemoDone] = useState(false);

  const [gridLimitVal, setGridLimitVal] = useState(5);

  const [grid, setGrid] = useState(null);

  useEffect(() => {
    updateGridSize();
  }, []);

  useEffect(() => {
    const sub = ecsEvent$.subscribe((e) => {
      console.log("ecsEvent$::eventType", e.type);
      if (e.type === NetworkEvents.NetworkComponentUpdate) {
        console.log(
          "NetworkComponentUpdate",
          e.namespace,
          e.table,
          e.key,
          e.value
        );

        // Manually store the updates in the store cache
        if (e.value) storeCache.set<any>(e.namespace, e.table, e.key, e.value);
        else storeCache.remove(e.namespace, e.table, e.key);
      }
    });
    console.log("storeCache", storeCache);
    return sub.unsubscribe();
  }, []);

  //must run on first txns after contract deploy
  const testNamespaceName = "ns1";
  const testTableName = "table1";
  const testFieldName = "field1";
  const testFieldIndex = "1";
  const testFieldValue = "hello world";
  const createDemo = async () => {
    await createNewNamespace(testNamespaceName);
    await createNewTableInNamespace(testNamespaceName, testTableName);
    await createNewFieldInTable(
      testNamespaceName,
      testTableName,
      testFieldName,
      testFieldIndex
    );
    await pushValueToField(
      testNamespaceName,
      testTableName,
      testFieldName,
      testFieldIndex,
      stringToBytes32(testFieldValue)
    );
  };

  const rows = useRows<any, string>(storeCache, {
    namespace: testNamespaceName,
    table: testTableName,
  });
  console.log("rows", rows);
  //===================================================================================================
  // ACCESSING TABLES
  //===================================================================================================

  // Access components either via ECS or via useRow as shown in the livestream
  // ECS queries can find by value, useRow can also find by key

  //all tables?
  // const tables = useTables();
  // console.log("tables", tables);

  console.log("TestKeyedData", TestKeyedData);

  const counter = useComponentValue(Counter, singletonEntity);
  const testData = useComponentValue(TestData, singletonEntity);
  const counter2 = useRow(storeCache, { table: "Counter", key: {} });
  const matchingEntities = useEntityQuery([Has(TestKeyedData)]);

  const matchingEntities2 = useEntityQuery([
    Has(TestKeyedData),
    HasValue(TestKeyedData, { testUint32: Number(recordId) }),
  ]);

  const tableInstances = matchingEntities.map((testEntity) =>
    getComponentValueStrict(TestKeyedData, testEntity)
  );

  //get table row by key (id)
  const testKeyedData2 = useRow(storeCache, {
    table: "TestKeyedData",
    key: { id: Number(recordId) },
  });

  //===================================================================================================
  // GET/SET GRID DATA
  //===================================================================================================

  const gridData = useEntityQuery([
    Has(Grid2D),
    HasValue(Grid2D, { isOccupied: true }),
  ]);
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

  const namespace = stringToBytes16(namespaceInput);
  // console.log("world", worldContract.address);
  // console.log("namespace", namespace);
  const tableName = stringToBytes16(tableNameInput);
  // const tableNameBytes32 = stringToBytes32(tableNameInput);

  //checking schema types for adding them in UI dynamically
  // console.log("schemeType uint256", SchemaType.UINT256); //31
  // console.log("schemeType bytes32", SchemaType.BYTES32); //95

  //TS Call: https://github.com/latticexyz/mud/blob/641d0d35912622c99fcbb347b0c0af15efc0ad11/examples/minimal/packages/contracts/types/ethers-contracts/IWorld.ts#LL975C1-L990C37
  //Sol Function Def: https://github.com/latticexyz/mud/blob/641d0d35912622c99fcbb347b0c0af15efc0ad11/packages/world/src/modules/core/implementations/WorldRegistrationSystem.sol#L52
  // working example of creating a table
  // registers namespace if not already registered
  // can NOT write to ROOT_NAME namespace
  // no resources at this selector yet (resources are namespaces, tables, and systems)
  //

  useEffect(() => {
    const sub = ecsEvent$.subscribe((ecsUpdate) => {
      console.log("got a new ecs event update", ecsUpdate);
      console.log("current namespace", namespaceInput, tableNameInput);
      if (
        ecsUpdate.namespace === namespaceInput &&
        ecsUpdate.table === tableNameInput
      ) {
        console.log("updating store cache");
        storeCache.set(ecsUpdate.namespace, ecsUpdate.table, ecsUpdate.key, {
          ...ecsUpdate.partialValue,
          ...ecsUpdate.value,
        });
      }
    });

    return () => sub?.unsubscribe();
  }, [namespaceInput, tableNameInput]);

  // useEffect(() => {

  //neither work, does storeCache either not store these new tables or need to be updated?
  const fieldDataFromNewTable = useRow(storeCache, {
    table: tableNameInput,
    key: { field1: stringToBytes32(testFieldValue) },
  });
  console.log("fieldDataFromNewTable", fieldDataFromNewTable);

  const allRows = useRows(storeCache);
  const newTableRows = useRows(storeCache, {
    namespace: namespaceInput,
    table: tableNameInput,
  });
  console.log("storeCache", storeCache);
  console.log("all rows", allRows);
  console.log("new table rows", tableNameInput, newTableRows);

  //===================================================================================================
  // UI
  //===================================================================================================

  return (
    <>
      <title>MUD v2 Examples</title>

      <h1>MUD v2 Examples</h1>
      <p>________________________________________________________</p>

      <h2>Push new record to table (overwrite old record)</h2>
      <div>
        <p>
          Counter: <span>{counter?.counterValue ?? "??"}</span>, Counter2:{" "}
          <span>{counter2?.value.counterValue ?? "??"}</span>
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
      <p></p>
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
      <p></p>
      <h2>Push new record to table (overwrite old record)</h2>
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
          TestData testUint32Array:{" "}
          <span>{testData?.testUint32Array[0] ?? "??"}</span>,{" "}
          <span>{testData?.testUint32Array[1] ?? "??"}</span>,{" "}
          <span>{testData?.testUint32Array[2] ?? "??"}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "testData record testUint32:",
            await pushRecordToTestData()
          );
        }}
      >
        Push Record
      </button>
      <p></p>
      <h2>Add record to table by id</h2>
      <p>
        {/* get data from testKeyedData of key recordId */}
        TestKeyedData testUint32:{" "}
        <span>{testKeyedData2?.value?.testUint32 ?? "??" ?? "??"}</span>
      </p>
      <p>
        TestKeyedData testBytes32:{" "}
        <span>{testKeyedData2?.value?.testBytes32 ?? "??"}</span>
      </p>
      <div>
        <input
          onChange={(event) => {
            event.preventDefault();
            setRecordId(event.target.value);
          }}
        />
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            await pushRecordToTestKeyedData(recordId);
          }}
        >
          Push Record by Key ID
        </button>
      </div>

      <p>________________________________________________________</p>
      <h2>Namespace, Table, (Metadata), Field, Record Creation</h2>
      <p>
        Keep all values the same throughout, i.e., don't change namespace
        between namespace and table creation...
      </p>
      <h3>Create Namespace (namespaceName)</h3>

      <div>
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            await createDemo();
          }}
        >
          Demo (view txns in console)
        </button>

        <p></p>

        <input
          onChange={(event) => {
            event.preventDefault();
            setNamespaceInput(event.target.value);
          }}
        />
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            await createNewNamespace(namespaceInput);
          }}
        >
          createNewNamespace
        </button>

        <p></p>
        <h3>Create Table (namespaceName, tableName)</h3>
        <div>
          <input
            onChange={(event) => {
              event.preventDefault();
              setTableNameInput(event.target.value);
            }}
          />
          <button
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              await createNewTableInNamespace(namespaceInput, tableNameInput);
            }}
          >
            createNewTableInNamespace
          </button>
        </div>
        <p></p>
        <h3>Create Field (fieldName, fieldIndex)</h3>
        <p>
          fieldIndex must be {">"} 0 and possibly {"<"} number of fields defined
          in schema (1 atm)
        </p>
        <p>
          system currently accommodates one field whose input data can fit in
          bytes32
        </p>
        <p>
          auto-creates metadata in system function call (reason for one field
          limit atm...)
        </p>
        <div>
          <input
            onChange={(event) => {
              event.preventDefault();
              setFieldNameInput(event.target.value);
            }}
          />
          <input
            onChange={(event) => {
              event.preventDefault();
              setFieldIndexInput(event.target.value);
            }}
          />
          <button
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              await createNewFieldInTable(
                namespaceInput,
                tableNameInput,
                fieldNameInput,
                fieldIndexInput
              );
            }}
          >
            createNewFieldInTable
          </button>
        </div>

        <div>
          <p></p>
          <h2>Push to Field (inputData)</h2>

          <input
            onChange={(event) => {
              event.preventDefault();
              setPushToFieldInput(event.target.value);
            }}
          />

          <button
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              console.log(
                "stringToBytes32(pushToFieldInput)",
                stringToBytes32(pushToFieldInput)
              );
              await pushValueToField(
                namespaceInput,
                tableNameInput,
                fieldNameInput,
                fieldIndexInput,
                stringToBytes32(pushToFieldInput)
              );
            }}
          >
            pushValueToField
          </button>
        </div>

        <div>
          <p></p>
          <h2>Get Field (recordId)</h2>
          <p>
            recordId must be {">"} 0 and {"<"} number of records in table
          </p>
          <button
            onClick={async (event) => {
              event.preventDefault();
              console.log(
                await getValueFromField(
                  namespaceInput,
                  tableNameInput,
                  fieldNameInput,
                  fieldIndexInput
                )
              );
            }}
          >
            getValueFromField
          </button>
        </div>
      </div>
      <div>
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
              await setGridLimit(gridLimitVal, gridLimitVal);
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
