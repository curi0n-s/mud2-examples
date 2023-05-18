// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter, CounterData } from "../codegen/Tables.sol";

contract IncrementSystem is System {
  function increment() public returns (uint32) {
    CounterData memory counterData = Counter.get();
    uint32 newValue = counterData.counterValue + 1;
    uint32 newValue2 = counterData.counterValueSquared;
    Counter.set(newValue, newValue2);
    return newValue;
  }

  function incrementSquared() public returns (uint32) {
    CounterData memory counterData = Counter.get();
    uint32 newValue = counterData.counterValue;
    uint32 newValue2 = counterData.counterValue ** 2;
    Counter.set(newValue, newValue2);
    return newValue2;
  }


}
