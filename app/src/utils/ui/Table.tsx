import { createEffect, createSignal, For , Switch, Match} from "solid-js";
import { Cell } from "../logic/Cell";
import { TableState } from "../logic/rulesets/TableState";
import composeClassnames from "./compose-classnames";


export const Table = (props : TableState) => {
    const [table, setTable] = createSignal<TableState>();

    createEffect( () => {
        setTable(props);
    })
    return (
        <table class = "table-auto-mt-2 border-collapse">
          <tbody>
             <For each = {table()?.cells}>
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
                                cell.row === 9 ? "border-b-8" : "")}>
                              <div class = "h-16 w-16">
                              <Switch> 
                                    <Match when={cell.value === 0}> </Match>
                                    <Match when={cell.value !== 0}> 
                                        <div class = "text-center align-middle text-3xl leading-loose">
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