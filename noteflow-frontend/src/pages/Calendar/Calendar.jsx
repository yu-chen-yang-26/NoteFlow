import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { StaticDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Calendar.scss";
import { useTranslation } from "react-i18next";
import { Editor } from "../../Components/Editor/Editor";
import { useQuill } from "../../API/useQuill";
import { useApp } from "../../hooks/useApp";
import { Colab } from "../../API/Colab";
import { useState, useEffect } from "react";
import instance from "../../API/api";

const Calendar = () => {
  const { user, isMobile } = useApp();
  const { t } = useTranslation();
  const [nodes, setNodes] = useState([]);
  const { OpenEditor, QuillRef } = useQuill();
  const [editorId, setEditorId] = useState(null);
  const NodeButton = styled(Button)(({ theme, selected }) => ({
    color: theme.palette.getContrastText(grey[100]),
    fontSize: "12px",
    backgroundColor: selected ? "#E0E0E0" : "white",
    borderRadius: selected ? "5px" : "0",
    "&:hover": {
      backgroundColor: selected ? "#E0E0E0" : grey[100],
    },
    width: "90%",
    height: 70,
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "95%",
      height: "1px",
      backgroundColor: "#E0E0E0",
    },
  }));
  const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateString = year + "-" + month + "-" + day;
    return dateString;
  };
  const [colab, setColab] = useState([]);
  const toNode = (id) => {
    setEditorId(id);
  };
  useEffect(() => {
    instance
      .get("/library")
      .then((res) => {
        setNodes([...nodes, ...res.data]);
        setEditorId([...nodes, ...res.data][0].id);
        console.log(res.data);
        console.log("ok!");
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  useEffect(() => {
    console.log(!editorId);
    if (!editorId) return;
    OpenEditor(editorId);
    const connection = new Colab(editorId, user.email, (members) => {
      console.log(members);
      setColab(members);
    });
    return () => {
      console.log("CLOSING colab connection");
      connection.close();
    };
  }, [editorId]);
  return (
    <Grid container columns={12} sx={{ p: 0, m: 0, height: "100%" }}>
      {/* <Grid item xs={6}> */}
      <Grid item xs={12} md={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {isMobile ? (
            <MobileDatePicker
              defaultValue={dayjs(getDate())}
              autoFocus={true}
              format="YYYY-DD-MM"
              sx={{ width: "100%" }}
            />
          ) : (
            <StaticDatePicker
              defaultValue={dayjs(getDate())}
              autoFocus={true}
              sx={{ width: "100%" }}
            />
          )}
        </LocalizationProvider>
      </Grid>
      <Grid
        item
        xs={12}
        md={2}
        sx={{
          //手機不顯示 border
          borderLeft: isMobile ? "none" : "1px solid grey",
          paddingTop: "1vmin",
          height: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "top",
          alignItems: "center",
        }}
      >
        {nodes.map((node) => (
          <NodeButton
            onClick={() => toNode(node.id)}
            key={node.id}
            selected={node.id === editorId}
          >
            {node.name} {t("Last Edit Time:")} {node.time} {t("hours")}
          </NodeButton>
        ))}
      </Grid>
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          //手機不顯示 border
          borderLeft: isMobile ? "none" : "none",
        }}
      >
        <Editor
          editorId={editorId}
          handleDrawerClose={() => {}}
          QuillRef={QuillRef}
          colab={colab}
        />
      </Grid>
    </Grid>
  );
};
export default Calendar;