import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  {
    Counter,
    TestData,
    TestKeyedData,
    Grid2D,
    Grid2DTags,
    Grid2DTagger,
    GridConstants,
    NamespaceOwner,
  }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldSend("testing_IncrementSystem_increment", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const incrementSquared = async () => {
    const tx = await worldSend("testing_IncrementSystem_incrementSquared", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Counter, singletonEntity);
  };

  const pushRecordToTestData = async () => {
    const tx = await worldSend("testing_TestDataSystem_pushRecordToTestData", []);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(TestData, singletonEntity);
  };

  const pushRecordToTestKeyedData = async (id: number) => {
    const tx = await worldSend("testing_TestKeyedDataSys_pushRecordToTestKeyedData", [id]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(TestKeyedData, { id });
  };

  const createNewNamespace = async (namespace: string) => {
    const tx = await worldSend("testing_UICreatorSystem_createNewNamespace", [namespace]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
  };

  const createNewTableInNamespace = async (namespace: string, tableName: string) => {
    const tx = await worldSend("testing_UICreatorSystem_createNewTableInNamespace", [namespace, tableName]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(NamespaceOwner, { namespace, tableName });
  };

  const createNewFieldInTable = async (namespace: string, tableName: string, fieldName: string, fieldIndex: number) => {
    const tx = await worldSend("testing_UICreatorSystem_createNewFieldInTable", [
      namespace,
      tableName,
      fieldName,
      fieldIndex,
    ]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(NamespaceOwner, { namespace, tableName, fieldName, fieldIndex });
  };

  const pushValueToField = async (
    namespace: string,
    tableName: string,
    fieldName: string,
    fieldIndex: number,
    inputData: string
  ) => {
    const tx = await worldSend("testing_UICreatorSystem_pushValueToField", [
      namespace,
      tableName,
      fieldName,
      fieldIndex,
      inputData,
    ]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(NamespaceOwner, { namespace, tableName, fieldName, fieldIndex, inputData });
  };

  const setGridPointData = async (x: number, y: number, isOccupied: boolean, data: string, author: string) => {
    const tx = await worldSend("testing_Grid2DSystem_setGridPointData", [x, y, isOccupied, author, data]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(Grid2D, { x, y });
  };

  const setGridLimit = async (x: number, y: number) => {
    const tx = await worldSend("testing_GridConstantsSys_setLimits", [x, y]);
    await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    return getComponentValue(GridConstants, singletonEntity);
  };

  return {
    increment,
    incrementSquared,
    pushRecordToTestData,
    pushRecordToTestKeyedData,
    createNewNamespace,
    createNewTableInNamespace,
    createNewFieldInTable,
    pushValueToField,
    setGridPointData,
    setGridLimit,
  };
}
