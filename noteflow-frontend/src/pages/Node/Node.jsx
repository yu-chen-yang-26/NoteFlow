import PageTab from "../../Components/PageTab/PageTab";
import { Editor } from "../../Components/Editor/Editor";
import { useFlowStorage } from "../../storage/Storage";
import { useLocation } from "react-router-dom";
import "./Node.scss";
const Node = () => {
  const flows = useFlowStorage((state) => state.flows);
  const flowID = "user1_1";
  const nodes = flows.filter((n) => n.id === flowID)[0].nodes;
  const location = useLocation();
  const saveNodeLabel = () => {};
  const handleDrawerClose = () => {};
  return (
    <div className="Node-container">
      <PageTab />
      <div className="EditorContainer">
        <Editor
          nodes={nodes}
          flowID={flowID}
          nodeID={location.state.id}
          saveNodeLabel={saveNodeLabel}
          handleDrawerClose={handleDrawerClose}
        />
      </div>
    </div>
  );
};
export default Node;
