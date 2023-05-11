import Sidebar from '../../Components/Sidebar/Sidebar.jsx';

import './Main.scss';
import FlowGrid from '../../Components/FlowGrid/FlowGrid.jsx';
import PageTab from '../../Components/PageTab/PageTab.jsx';
import Library from '../../Components/Library/Library.jsx';
import { useFlowStorage } from '../../storage/Storage';
import Calendar from '../../Components/Calendar/Calendar.jsx';
import Settings from '../../Components/Settings/Settings.jsx';

export default function Main() {
  const mode = useFlowStorage((state) => state.mode);
  console.log(mode);
  return (
    <div className='App'>
      <div className='App-container'>
        <Sidebar />
        <div className='App-tab'>
          <PageTab />
          <div className='Flow-grid'>
            {mode === 0 ? (
              <FlowGrid />
            ) : mode === 1 ? (
              <Library />
            ) : mode === 2 ? (
              <Calendar />
            ) : (
              <Settings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
