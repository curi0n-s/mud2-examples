// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------
    //Presumably this has to operate on the root namespace

    // Call increment on the world via the registered function selector
    // IWorld(worldAddress).registerNamespace("mud")

    // IWorld(worldAddress).grantAccess(
    //   stringToBytes16("test"),
    //   stringToBytes16("test"),
    //   msg.sender
    // );

    /**
    ON NAMESPACES AND FUNCTION CALLS:
      for all namespaces except the root namespace the function selector that is registered for the system is 
      <namespace>_<system>_<funcSelector> (for the root namespace it's just funcSelector)
      so as an example, if you register the IncrementSystem in the foo namespace,  
      your IncrementSystem.increment() function would be registered as World.foo_IncrementSystem_increment()
     */

    // uint32 newValue = IWorld(worldAddress).increment();
    // uint32 newValue = IWorld(worldAddress).testing_IncrementSystem_increment();

    // console.log("Increment via IWorld:", newValue);

    // uint32 newValueSquared = IWorld(worldAddress).testing_IncrementSystem_incrementSquared();
    // console.log("Increment squared via IWorld:", newValueSquared);
   
    // // create new table
    // bytes16 table = stringToBytes16("testTable");
    // bytes16 namespace = stringToBytes16("testNamespace");
    // bytes32 tableId = IWorld(worldAddress).registerTable( 
    //   namespace,
    //   table, 
    //   SchemaLib.encode(SchemaType.BYTES32),
    //   SchemaLib.encode(SchemaType.BYTES32)
    // );

    // console.log("New table selector:", bytes32ToString(tableId));

    // //setField via name, via tableId
    // bytes32[] memory key = new bytes32[](0);
    // key[0]= "testKey";

    // IWorld(worldAddress).setField(
    //   namespace,
    //   table,
    //   key,
    //   0,
    //   abi.encodePacked(true)
    // );

    // IWorld(worldAddress).setField(
    //   tableId, 
    //   key, 
    //   0, 
    //   abi.encodePacked(false)
    // );


    //get(world, tableId)

    //setMetadata

    //set

    vm.stopBroadcast();

    vm.startBroadcast(vm.envUint("PRIVATE_KEY2"));
      //create new namespace?

    vm.stopBroadcast();




  }

  function stringToBytes16(string memory input) public pure returns (bytes16) {
      bytes16 output;
      assembly {
          output := mload(add(input, 32))
      }
      return output;
  }

  function bytes32ToString(bytes32 value) public pure returns (string memory) {
      bytes memory bytesArray = new bytes(32);
      for (uint256 i = 0; i < 32; i++) {
          bytesArray[i] = value[i];
      }
      return string(bytesArray);
  }

}
