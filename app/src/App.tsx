import './App.css';
import { createEffect, createSignal } from 'solid-js';
import { Table} from './utils/ui/Table';
import { generateTable, isTableSatisfied, setValueAt, TableState } from './utils/logic/rulesets/TableState';
import solve from './utils/solver/solve';
import { Cell } from './utils/logic/Cell';

function App() {
  const [table, setTable] = createSignal<TableState>(generateTable());
  const [step, setStep] = createSignal(0);
  const [selection, setSelection] = createSignal<{r : number, c : number}>({r: -1, c: -1});

  addEventListener('keypress', onKey);

  function onNextStep() {
    if (!isTableSatisfied(table())) {
      setStep(step() + 1);
      console.log("Step %d", step());
      setTable(solve(table()));
      duplicate();
    } else {
      console.log("Finished!");
    }
  }

  function onCellClick(coordinate : [number, number]) {
    setSelection({r : coordinate[0], c  : coordinate[1]});
  }

  function onKey(event : KeyboardEvent) {
    if (selection().c !== -1 && selection().r !== -1) {
      if (0 <= parseInt(event.key) && parseInt(event.key) <= 9){
        setValueAt(table(), selection().r, selection().c, parseInt(event.key), true);
        duplicate();
      }
    }
  }

  function duplicate(){
    const cells = [];
    for (let i = 0; i < 9; i++) {
      const temp = [];
      for (let j = 0; j < 9; j++) {
        temp.push(table().cells[i][j]);
      }
      cells.push(temp);
    }
    setTable ({
      cells : cells,
      regions : table().regions
    })
  }

  return (
    <div class="App">
      <div>
        <Table t = {table()} onClick = {onCellClick} selection = {selection()}/>
      </div>

      <div class = "mt-8"> 
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick = {onNextStep}>
          Next Step
        </button>
      </div>
    </div>
  );
}

export default App;
