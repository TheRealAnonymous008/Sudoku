import logo from './logo.svg';
import './App.css';
import { createEffect, createSignal } from 'solid-js';
import { Table} from './utils/ui/Table';
import { generateTable, TableState } from './utils/logic/rulesets/TableState';

function App() {
  const [table, setTable] = createSignal<TableState>(generateTable());

  createEffect (() => {
    console.log( table().rules[0].isValid());
  })

  return (
    <div class="App">
      <Table cells = {table().cells} rules = {table().rules} />
    </div>
  );
}

export default App;
