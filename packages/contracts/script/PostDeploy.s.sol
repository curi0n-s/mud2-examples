// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------

    // Call increment on the world via the registered function selector
    uint32 newValue = IWorld(worldAddress).increment();
    console.log("Increment via IWorld:", newValue);

    uint32 newValueSquared = IWorld(worldAddress).incrementSquared();
    console.log("Increment squared via IWorld:", newValueSquared);

    // Call pushRecordToTestData
    uint32[] memory testArray = new uint32[](3);
    testArray[0] = 1;
    testArray[1] = 2;
    testArray[2] = 3;
    IWorld(worldAddress).setInitialArray(testArray);
    uint32 testUint32 = IWorld(worldAddress).pushRecordToTestData();
    console.log("Pushed record to TestData:", testUint32);

    // keyed data testing
    uint32 testUint32FromKeyed = IWorld(worldAddress).pushRecordToTestKeyedData(0);
    console.log("Pushed record to TestKeyedData:", testUint32FromKeyed);

    vm.stopBroadcast();
  }
}
