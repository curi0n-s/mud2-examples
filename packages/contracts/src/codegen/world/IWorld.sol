// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

import { IBaseWorld } from "@latticexyz/world/src/interfaces/IBaseWorld.sol";

import { IGrid2DSystem } from "./IGrid2DSystem.sol";
import { IGridConstantsSystem } from "./IGridConstantsSystem.sol";
import { IIncrementSystem } from "./IIncrementSystem.sol";
import { ITestDataSystem } from "./ITestDataSystem.sol";
import { ITestKeyedDataSystem } from "./ITestKeyedDataSystem.sol";
import { IUICreatorSystem } from "./IUICreatorSystem.sol";

/**
 * The IWorld interface includes all systems dynamically added to the World
 * during the deploy process.
 */
interface IWorld is
  IBaseWorld,
  IGrid2DSystem,
  IGridConstantsSystem,
  IIncrementSystem,
  ITestDataSystem,
  ITestKeyedDataSystem,
  IUICreatorSystem
{

}
