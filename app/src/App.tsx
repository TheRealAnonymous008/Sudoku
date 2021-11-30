import logo from './logo.svg';
import './App.css';
import { createComputed, createEffect, createSignal } from 'solid-js';
import { Table} from './utils/ui/Table';
import { generateTable, setValueAt, TableState } from './utils/logic/rulesets/TableState';
import solve from './utils/solver/solve';

function App() {
  const [table, setTable] = createSignal<TableState>(generateTable());
  const [step, setStep] = createSignal(1);

  function onNextStep() {
    setStep(step() + 1);
    const newTable = solve(table());
    duplicate();
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
      cells : cells
    })
  }

  return (
    <div class="App">
      <div>
        <Table cells = {table().cells}/>
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
