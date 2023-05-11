import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Calendar.scss";

const Calendar = () => {
  // const { t } = useTranslation();
  const NodeButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[100]),
    fontSize: "12px",
    fontFamily: "Bauhaus",
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
      <Grid
        item
        xs={6}
        sx={{
          height: "100%",
          "& .MuiPickersDay-root": {
            paddingTop: 0.5,
            ":focus": {
              backgroundColor: "black",
              color: "white",
            },
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker defaultValue={dayjs(getDate())} />
        </LocalizationProvider>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          padding: 2,
          height: "100%",
          borderLeft: "1px solid grey",
        }}
      >
        <Grid container columns={12} spacing={2}>
          {nodes.map((node, id) => (
            <Grid item xs={4} md={4} key={id}>
              <NodeButton>Last Edit Time: {node.time} hours</NodeButton>
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
