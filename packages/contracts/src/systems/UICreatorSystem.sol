// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { NamespaceOwner, NamespaceOwnerTableId, OwnerNamespaces, OwnerNamespacesTableId } from "../codegen/Tables.sol";
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
/**
-Assumes namespace already exists check is done elsewhere

if you want anyone to be able to register a namespace the best approach would 
be to create a new system, which calls World.registerTable with a new namespace 
(so now the system is the owner of the namespace and anyone can call the system 
to register new tables in the namespace)


 */

contract UICreatorSystem is System {

    error NamespaceAlreadyExists(bytes16 namespace);

    function createNewNamespace(string memory name) public returns (bytes16) {
        bytes16 namespace = stringToBytes16(name);

        if(NamespaceOwner.get(namespace) != address(0)) {
            revert NamespaceAlreadyExists(namespace);
        }

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

    createNewFieldInTable(string memory tableName, string memory fieldName) public returns (bytes32) {
        return (
            IWorld(_world()).registerField(
                stringToBytes16(tableName),
                stringToBytes16(fieldName),
                SchemaLib.encode(SchemaType.BYTES32)
            )
        );
    }

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

}
