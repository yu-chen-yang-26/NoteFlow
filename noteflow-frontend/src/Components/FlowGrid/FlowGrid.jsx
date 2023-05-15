import React, { useEffect, useState, useRef } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useFlowStorage } from "../../storage/Storage";
import { useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import instance from "../../API/api";
import { useApp } from "../../hooks/useApp";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import "./FlowGrid.scss";
export default function FlowGrid() {
  const { t, i18n } = useTranslation();
  const { user } = useApp();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const tabList = useFlowStorage((state) => state.tabList);
  const addTab = useFlowStorage((state) => state.addTab);
  const loadingCheckPointRef = useRef(null);
  const changeFlowNow = useFlowStorage((state) => state.changeFlowNow);
  const FlowButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    backgroundColor: "white",
    border: "1px black solid",
    "&:hover": {
      backgroundColor: grey[100],
      border: "1px grey solid",
    },
    width: "100%",
    aspectRatio: "3/2",
  }));
  const options = {
    root: null,
    threshold: 0,
  };
  const fetchFlows = async () => {
    console.log(flows.length);
    const nextPage = page + 1;
    await instance
      .get("/flows", { params: { page } })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.length == 0) {
            observeforFetching.unobserve(loadingCheckPointRef.current);
          } else {
            setFlows([...flows, ...res.data]);
            setPage(nextPage);
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const observeforFetching = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          await fetchFlows();
        }
      });
    }, options);
    let loadingCheckPointEle = loadingCheckPointRef.current;
    if (loadingCheckPointEle) observeforFetching.observe(loadingCheckPointEle);

    return () => {
      let loadingCheckPointEle = loadingCheckPointRef.current;
      if (loadingCheckPointEle)
        observeforFetching.unobserve(loadingCheckPointEle);
    };
  }, [page, loading]);

  useEffect(() => {
    if (!user) return;
    fetchFlows();
  }, [user]);

  const toFlow = (flow) => {
    console.log("flow:", flow);
    if (!tabList.find((f) => f.id == flow.id)) {
      addTab({
        id: flow.id,
        title: flow.name ? flow.name : "Undefined",
      });
    }
    changeFlowNow(flow);
    navigate(`/flow?id=${flow.id}`);
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <div className="flow-container">
        {flows.map((flow, key) => (
          <div className="grid-item" key={key}>
            <FlowButton onClick={() => toFlow(flow)}>
              {t("Last Edit Time:")} {flow.time} {t("hours")}
            </FlowButton>
            <Typography>{flow.name}</Typography>
          </div>
        ))}

        <div
          className="loading-checkpoint"
          ref={loadingCheckPointRef}
          style={{ visibility: "hidden" }}
        >
          CHECKPOINT
        </div>
      </div>
    </>
  );
}
