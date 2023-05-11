import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import { styled, createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { Paper, Toolbar, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { FaHome } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Navigate, useNavigate } from "react-router-dom";
import { useFlowStorage } from "../../storage/Storage";
import CloseIcon from "@mui/icons-material/Close";
import instance from "../../API/api";
import { useApp } from "../../hooks/useApp";

const theme = createTheme({
  palette: {
    primary: {
      main: grey[700],
    },
  },
});
export default function PageTab({ flows }) {
  // const flowNow = useFlowStorage((state) => state.flowNow);
  // const changeFlowNow = useFlowStorage((state) => state.changeFlowNow);
  // const flows = useFlowStorage((state) => state.flows); // TODO: delete
  const tabList = useFlowStorage((state) => state.tabList);
  const addFlow = useFlowStorage((state) => state.addFlow);
  const addTab = useFlowStorage((state) => state.addTab);
  const closeTab = useFlowStorage((state) => state.closeTab);
  const { user } = useApp();
  // const [flowNow, setFlowNow] = useState
  const navigate = useNavigate();

  const TabButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    backgroundColor: grey[700],
    border: "0px",
    borderColor: grey[700],
    "&:hover": {
      backgroundColor: grey[600],
      border: "0px",
    },
    width: 100,
    height: 40,
  }));

  const CloseButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    backgroundColor: grey[700],
    border: "0px",
    "&:hover": {
      backgroundColor: grey[600],
      border: "0px",
    },
    width: 40,
    height: 40,
  }));
  const backToHome = () => {
    navigate("/home");
  };

  const toThatTab = (payload) => {
    const flow = flows.find((f) => f.id == payload.id);
    navigate("/flow", { state: flow });
  };

  const clickCloseTab = (payload) => {
    console.log(payload);
    closeTab(payload);
    navigate("/home");
  };

  const addNewFlow = () => {
    // const payload = {
    //   id:'user1_'+Math.floor(Math.random() * 10000),
    //   name:'Untitle',
    //   nextNodeId:1,
    //   nodes:[],
    //   edges:[],
    // }
    // addFlow(payload)
    // addTab({id:payload.id, title:payload.name});
    instance
      .post("flows/create", { user })
      .then(async (res) => {
        if (res.status === 200) {
          console.log(res);
          navigate(`/flow?id=${res.data}`);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {/* {changeTab && <Navigate to="/flow" state={{ flowNow }}/>} */}
      <Toolbar
        sx={{
          backgroundColor: "black",
          paddingBottom: 0,
          width: "100%",
          "@media (min-width: 600px)": {
            minHeight: "55px",
          },
        }}
        className="toolbar"
        direction="row"
        spacing={2}
      >
        <IconButton size="medium" onClick={backToHome}>
          <FaHome color="white" size={15} />
        </IconButton>
        <Stack direction="row" spacing={1}>
          {tabList.map((tab, id) => {
            let tabTitle = tab.title;
            if (tabTitle.length > 7) {
              tabTitle = tabTitle.substring(0, 6) + "...";
            }

            return (
              <ButtonGroup color="primary" variant="outlined" key={id}>
                <TabButton onClick={() => toThatTab(tab)}>
                  <Typography color="white">{tabTitle}</Typography>
                </TabButton>
                <CloseButton size="small" onClick={() => clickCloseTab(tab)}>
                  <RxCross2 color="white" size={15} />
                </CloseButton>
              </ButtonGroup>
            );
          })}
        </Stack>
        <IconButton size="medium" onClick={addNewFlow}>
          <FaPlus color="white" size={15} />
        </IconButton>
      </Toolbar>
    </>
  );
}
