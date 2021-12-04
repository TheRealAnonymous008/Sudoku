import { createEffect, createSignal, For , Switch, Match, createRenderEffect, createComputed} from "solid-js";
import { Cell } from "../logic/Cell";
import { generateTable, TableState } from "../logic/rulesets/TableState";
import composeClassnames from "./compose-classnames";


export const Table = (props : { t : TableState, 
                                onClick : (coordinate : [number, number]) => void,
                                selection : {r : number, c : number};
}) => {
    return (
        <table class = "table-auto-mt-2 border-collapse">
          <tbody>
             <For each = {props.t.cells}>
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
                                cell.row === props.selection.r && cell.column === props.selection.c ? "bg-blue-100": "")}
                            onClick = {() => props.onClick([cell.row, cell.column])}
                            >
                              <div class = "h-16 w-16">
                              <Switch> 
                                    <Match when={cell.value === 0}> 
                                        <div class = "grid grid-flow-rows grid-cols-3 grid-rows-3">
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