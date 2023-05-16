import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { StaticDatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useApp } from "../../hooks/useApp";
import "./Calendar.scss";

const Calendar = () => {
  const { isMobile } = useApp();
  // const { t } = useTranslation();
  const NodeButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    fontSize: "12px",
    backgroundColor: "white",
    border: "1px black solid",
    "&:hover": {
      backgroundColor: grey[100],
      border: "1px grey solid",
    },
    width: "100%",
    height: 150,
  }));
  const nodes = [
    { src: "", name: "Card", time: "1" },
    { src: "", name: "PDF", time: "1" },
    { src: "", name: "Video", time: "2" },
    { src: "", name: "PDF1", time: "2" },
    { src: "", name: "Card1", time: "3" },
    { src: "", name: "Card2", time: "3" },
    { src: "", name: "Card3", time: "4" },
    { src: "", name: "PDF2", time: "4" },
    { src: "", name: "Card4", time: "5" },
  ];
  const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const dateString = year + "-" + month + "-" + day;
    return dateString;
  };

  return (
    <Grid container columns={12} sx={{ p: 0, m: 0, height: "100%" }}>
      {/* <Grid item xs={6}> */}
      <Grid item xs={12} md={6}>
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
        md={6}
        sx={{
          padding: 2,
          height: "90%",
          //手機不顯示 border
          borderLeft: isMobile ? "none" : "1px solid grey",
        }}
      >
        <Grid container columns={12} spacing={"2vw"}>
          {nodes.map((node, id) => (
            <Grid item xs={4} md={4} key={id}>
              <NodeButton sx={{ height: isMobile ? "10vh" : "20vh" }}>
                Last Edit Time: {node.time} hours
              </NodeButton>
              <Typography
                style={{
                  fontSize: "12px",
                  paddingTop: "2%",
                }}
              >
                {node.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Calendar;
