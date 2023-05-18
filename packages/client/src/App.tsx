import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { useState } from "react";

export const App = () => {
  const {
    components: { Counter, TestData, TestKeyedData },
    systemCalls: { increment, incrementSquared, pushRecordToTestData, pushRecordToTestKeyedData },
    network: { singletonEntity },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);
  const testData = useComponentValue(TestData, singletonEntity);
  const testKeyedData = useComponentValue(TestKeyedData);

  let newKeyedData;

  const [recordId, setRecordId] = useState("");
  const [testUint32Val, setTestUint32Val] = useState(0);

  return (
    <>
      <div>
        Counter: <span>{counter?.counterValue ?? "??"}</span>
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
        TestKeyedData testUint32: <span>{testUint32Val ?? "??"}</span>
      </p>
      <div>
        <input
          onChange={(event) => {
            event.preventDefault();
            setRecordId(event.target.value);
            setTestUint32Val(testKeyedData?.[recordId]?.testUint32 ?? "??");
          }}
        />
      </div>
      <button
        type="button"
        onClick={async (event) => {
          event.preventDefault();
          await pushRecordToTestKeyedData(recordId);
          setTestUint32Val(testKeyedData?.[recordId]?.testUint32 ?? "??");
        }}
      >
        Push Record by Key ID
      </button>
    </>
  );
};
