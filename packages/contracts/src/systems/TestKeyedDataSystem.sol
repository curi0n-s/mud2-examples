// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { TestKeyedData, TestKeyedDataData } from "../codegen/Tables.sol";

contract TestKeyedDataSystem is System {
  
    function pushRecordToTestKeyedData(uint32 _id) public returns (uint32) {

        /**
            TestKeyedData: {
            keySchema: {
                id: "uint32",
                address: "address",
            },
            schema: {
                testUint32: "uint32",
                testBytes32: "bytes32",
            }
            },
        */

        TestKeyedDataData memory testKeyedDataData = TestKeyedData.get(_id);
        
        uint32 testUint32 = testKeyedDataData.testUint32 + 1;
        bytes32 testBytes32 = bytes32(uint256(testUint32));

        TestKeyedData.set(
            _id,
            testUint32,
            testBytes32
        );

        return (
            testUint32
        );
    }

}
