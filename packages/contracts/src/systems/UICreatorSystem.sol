// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { NamespaceOwner, NamespaceOwnerTableId, OwnerNamespaces, OwnerNamespacesTableId } from "../codegen/Tables.sol";
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
/**
-Assumes namespace already exists check is done elsewhere
-Assumes all access checking is done in system contracts (i.e. namespace has already been created)

if you want anyone to be able to register a namespace the best approach would 
be to create a new system, which calls World.registerTable with a new namespace 
(so now the system is the owner of the namespace and anyone can call the system 
to register new tables in the namespace)

maybe using delegatecall could work for assigning namespace ownership to the 
caller of the function rather than to the system itself


 */

contract UICreatorSystem is System {

    error NamespaceAlreadyExists(bytes16 namespace);

    function createNewNamespace(string memory name) public returns (bytes16) {
        bytes16 namespace = stringToBytes16(name);

        OwnerNamespaces.push(_msgSender(), namespace);
        IWorld(_world()).registerNamespace(namespace);
        return namespace;
    }

    function createNewTableInNamespace(string memory namespaceName, string memory tableName) public returns (bytes32) {
        return (
            IWorld(_world()).registerTable(
                stringToBytes16(namespaceName), 
                stringToBytes16(tableName),
                SchemaLib.encode(SchemaType.BYTES32),
                SchemaLib.encode(SchemaType.BYTES32)
            )
        );
    }

    /**
    function setMetadata(
        bytes16 namespace,
        bytes16 name,
        string calldata tableName,
        string[] calldata fieldNames
    ) external;
   */

    function createNewFieldInTable(string memory namespaceName, string memory tableName, string memory fieldName, uint8 fieldIndex) public {
        bytes32[] memory keyArg = new bytes32[](1);
        keyArg[0] = stringToBytes32(fieldName);
        IWorld(_world()).setField(
            stringToBytes16(namespaceName), 
            stringToBytes16(tableName),
            keyArg,
            fieldIndex,
            abi.encodePacked(true)
        );

        string[] memory fieldNames = new string[](1);
        fieldNames[0] = fieldName;

        IWorld(_world()).setMetadata(
            stringToBytes16(namespaceName), 
            stringToBytes16(tableName),
            tableName,
            fieldNames
        );
    }

    function pushValueToField(string memory namespaceName, string memory tableName, string memory fieldName, uint8 fieldIndex, bytes calldata inputData) public {
        bytes32[] memory keyArg = new bytes32[](1);
        keyArg[0] = stringToBytes32(fieldName);
        IWorld(_world()).pushToField(
            stringToBytes16(namespaceName), 
            stringToBytes16(tableName),
            keyArg,
            fieldIndex,
            inputData
        );
    }

    // function pushValueToField(string memory namespaceName, string memory tableName, string memory fieldName, uint8 fieldIndex, string memory inputString) public {
    //     bytes32[] memory keyArg = new bytes32[](1);
    //     keyArg[0] = stringToBytes32(fieldName);
    //     IWorld(_world()).pushToField(
    //         stringToBytes16(namespaceName), 
    //         stringToBytes16(tableName),
    //         keyArg,
    //         fieldIndex,
    //         stringToBytes32(inputString)
    //     );
    // }

    //==================================================================
    // HELPERS
    //==================================================================

    function stringToBytes16(string memory input) public pure returns (bytes16) {
        bytes16 output;
        assembly {
            output := mload(add(input, 32))
        }
        return output;
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

}
