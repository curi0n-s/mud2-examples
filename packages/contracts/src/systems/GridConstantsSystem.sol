// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { GridConstants, GridConstantsData } from "../codegen/Tables.sol";

contract GridConstantsSystem is System {

    function setLimits(uint32 width, uint32 height) public {
        GridConstants.set(width, height);
    }

}
