// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { TestData } from "../codegen/Tables.sol";

contract TestDataSystem is System {
  function pushRecordToTestData() public returns (
    uint32
  ) {

    /**
        Fields:
        TestData: {
            keySchema: {},
            schema: {
                name: "string",
                testUint32: "uint32",
                testUintArray: "uint256[]",
                testBytes32: "bytes32",
            }
        }
     */

    string memory testString1 = "testString1";
    uint32 testUint32 = 123809237697836;
    uint256[] memory testUintArray = new uint256[](2);
    testUintArray[0] = 1;
    testUintArray[1] = 2;
    bytes32 testBytes32 = bytes32("testBytes32");

    TestData.set(
        testString1,
        testUint32,
        testUintArray,
        testBytes32
    );

    return (
        testUint32
    );
  }
}
