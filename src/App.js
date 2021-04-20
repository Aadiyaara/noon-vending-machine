import {useState, useEffect} from 'react'
import './App.css';
import MachineModeSelector from './components/machine/MachineModeSelector';
import {MachineMode} from './config/constants'
import Admin from './screens/admin/Admin';
import VendingBox from './screens/vending/Vending';

function App() {
  const [machineMode, setMachineMode] = useState(MachineMode.VENDING)
  const [items, setItems] = useState([])
  useEffect(() => {
    refetchItems()
  }, [])
  
  const refetchItems = () => {
    fetch('items').then(res => res.json().then(response => setItems(response.items))
    ).catch(err =>console.error(err))
  }

  return (
    <div className="App">
      <p class="title">Noon Vending Machine</p>
      <MachineModeSelector currentMode={machineMode} selector={setMachineMode} />
      {
        machineMode == MachineMode.ADMIN ? <Admin items={items} refetchItems={refetchItems} /> : <VendingBox items={items} refetchItems={refetchItems}/>
      }

    </div>
  );
}

export default App;
