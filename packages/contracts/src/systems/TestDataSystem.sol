// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { TestData, TestDataData } from "../codegen/Tables.sol";

contract TestDataSystem is System {
  function pushRecordToTestData() public returns (
    uint32
  ) {

    /**
        Fields:
        TestData: {
            keySchema: {},
            schema: {
                testUint32: "uint32",
                testBytes32: "bytes32",
                testString: "string",
                testUint32Array: "uint32[]",
            }
        }
     */

    // uint32 testUint32 = 127836;
    // bytes32 testBytes32 = bytes32(0);
    // string memory testString = "Hello World";
    // uint32[] memory testUint32Array = new uint32[](3);
    // testUint32Array[0] = 1;
    // testUint32Array[1] = 2;
    // testUint32Array[2] = 3;

    TestDataData memory testDataData = TestData.get();
    
    uint32 testUint32 = testDataData.testUint32 + 1;
    bytes32 testBytes32 = bytes32(uint256(testUint32));
    string memory testString = randomStringWithSeed(testUint32);
    testDataData.testUint32Array[0]+=1;
    testDataData.testUint32Array[1]+=2;
    testDataData.testUint32Array[2]+=3;

    TestData.set(
        testUint32,
        testBytes32,
        testString,
        testDataData.testUint32Array
    );

    return (
        testUint32
    );
  }

  function setInitialArray(uint32[] memory _array) public {
    TestData.setTestUint32Array(_array);
  }
 
  function randomStringWithSeed(uint32 _seed) public view returns (string memory) {
    //create string with 8 characters from the alphabet
    string memory alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    bytes memory alphabetBytes = bytes(alphabet);
    bytes memory randomString = new bytes(8);
    uint256 rand = uint256(keccak256(abi.encodePacked(_seed)));
    for (uint256 i = 0; i < 8; i++) {
        randomString[i] = alphabetBytes[rand % alphabetBytes.length];
        rand = rand / alphabetBytes.length;
    }
    return string(randomString);
    
  }

}
