import { useRef } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import "./Main.scss";
import FlowGrid from "../../Components/FlowGrid/FlowGrid.jsx";
import PageTab from "../../Components/PageTab/PageTab.jsx";
import Library from "../Library/Library.jsx";
import { useFlowStorage } from "../../storage/Storage";
import Calendar from "../Calendar/Calendar.jsx";
import Settings from "../../Components/Settings/Settings.jsx";
import BackToTopButton from "../../Components/BacktoTopButton/BackToTopButton.jsx";
import { useApp } from "../../hooks/useApp.jsx";

export default function Main() {
  const mode = useFlowStorage((state) => state.mode);
  const containerRef = useRef(null);

  //rwd
  const { isMobile } = useApp();

  return (
    // <div className="App">
    <div className={`${isMobile ? "App-container-mobile" : "App-container"}`}>
      <Sidebar />
      <div className="App-tab">
        <PageTab />
        <div className="Flow-grid" ref={containerRef}>
          {mode === 0 ? (
            <FlowGrid />
          ) : mode === 1 ? (
            <Library />
          ) : mode === 2 ? (
            <Calendar />
          ) : (
            <Settings />
          )}
          {/* {containerRef.current && (
            <BackToTopButton containerRef={containerRef} />
          )} */}

          {isMobile
            ? null
            : containerRef.current && (
                <BackToTopButton containerRef={containerRef} />
              )}
        </div>
      </div>
    </div>
  );
}
