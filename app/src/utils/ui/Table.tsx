import { createEffect, createSignal, For , Switch, Match, createRenderEffect, createComputed} from "solid-js";
import { Cell } from "../logic/Cell";
import { getRuleOfType, RuleType } from "../logic/rulesets/Rule";
import { getRecentDeduction, TableState } from "../logic/rulesets/TableState";
import composeClassnames from "./compose-classnames";
import { EvenRule } from "./rule-icons/EvenRule";
import { OddRule } from "./rule-icons/OddRule";


export const Table = (props : { table : TableState, 
                                onClick : (coordinate : [number, number]) => void,
                                selection : {r : number, c : number};
}) => {
    return (
        <table class = "table-auto-mt-2 border-collapse">
          <tbody>
             <For each = {props.table.cells}>
                {
                  (row : Cell[]) => (
                     <tr>
                      <For each= {row}>
                        {
                          (cell : Cell) => (
                            <td
                            aria-hidden = "true"
                            class = {composeClassnames("border-2 border-gray-800 p-2 bg-white ", 
                                cell.column %3 === 1 ? "border-l-8" : "",
                                cell.row %3 === 1 ? "border-t-8" : "",
                                cell.column === 9 ? "border-r-8" : "",
                                cell.row === 9 ? "border-b-8" : "",
                                cell.row === props.selection.r && cell.column === props.selection.c ? "bg-blue-100 bg-opacity-50": "",
                                getRecentDeduction(props.table).cause.includes(cell)?  "bg-red-100 bg-opacity-50" : "",
                                getRecentDeduction(props.table).effect.includes(cell) ? "bg-green-100 bg-opacity-50" : "",)}
                            onClick = {() => props.onClick([cell.row, cell.column])}
                            >
                              <div class = "container_row h-16 w-16 ">
                                <Switch>
                                  <Match when={getRuleOfType(cell, RuleType.EvenCell) !== null}>
                                    <EvenRule/>
                                  </Match>
                                  
                                  <Match when={getRuleOfType(cell, RuleType.OddCell) !== null}>
                                    <OddRule/>
                                  </Match>
                                </Switch>

                                <Switch> 
                                      <Match when={cell.value === 0}> 
                                          <div class = "layer2 grid grid-flow-rows grid-cols-3 grid-rows-3">
                                            <div> {cell.candidates.includes(1) ? 1 : ''} </div>
                                            <div> {cell.candidates.includes(2) ? 2 : ''} </div>
                                            <div> {cell.candidates.includes(3) ? 3 : ''} </div>
                                            <div> {cell.candidates.includes(4) ? 4 : ''} </div>
                                            <div> {cell.candidates.includes(5) ? 5 : ''} </div>
                                            <div> {cell.candidates.includes(6) ? 6 : ''} </div>
                                            <div> {cell.candidates.includes(7) ? 7 : ''} </div>
                                            <div> {cell.candidates.includes(8) ? 8 : ''} </div>
                                            <div> {cell.candidates.includes(9) ? 9 : ''} </div>
                                          </div>
                                      </Match>
                                      <Match when={cell.value !== 0}> 
                                          <div class = {composeClassnames("font-bold text-center align-middle text-4xl leading-loose",
                                              cell.isGiven ? "text-black": "text-blue-500")}>
                                              {cell.value}
                                          </div>
                                      </Match>
                                  </Switch>
                              </div>                       
                            </td>      
                          )                    
                        }
                      </For>
                    </tr>
                  )
                }
            </For>
          </tbody> 
        </table>
    );
};