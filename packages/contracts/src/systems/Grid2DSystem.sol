// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Grid2D, Grid2DData, GridConstants, GridConstantsData } from "../codegen/Tables.sol";

contract Grid2DSystem is System {

    error Unauthorized();

    modifier unoccupiedOrOwner(uint32 x, uint32 y) {
        if( !Grid2D.getIsOccupied(x, y) || _msgSender() == Grid2D.getAuthor(x, y) ){
            _;
        } else {
            revert Unauthorized();
        }
    }

    modifier withinGridLimits(uint32 x, uint32 y) {
        if( x <= GridConstants.getWidth() && y <= GridConstants.getHeight() ){
            _;
        } else {
            revert Unauthorized();
        }
    }

    function setGridPointData(
        uint32 x, 
        uint32 y, 
        bool isOccupied,
        bytes memory data,
        address author
    ) public unoccupiedOrOwner(x, y) withinGridLimits(x,y) {
        Grid2D.set(x, y, isOccupied, data, author);
    }

    /**
        struct Grid2D {
            bool isOccupied;
            bytes data;
            address author;
        }
    
     */

    function setGridPointData(
        uint32 x, 
        uint32 y, 
        Grid2DData memory data
    ) public unoccupiedOrOwner(x, y) withinGridLimits(x,y) {
        Grid2D.set(x, y, data);
    }

}
