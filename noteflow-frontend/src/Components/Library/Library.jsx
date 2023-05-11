import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { styled, alpha } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { BsSortDown } from "react-icons/bs";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { useFlowStorage } from "../../storage/Storage";
import { useNavigate } from "react-router-dom";

const Library = () => {
  // const { t } = useTranslation();
  const nodes = useFlowStorage((state) => state.nodes);
  const tabList = useFlowStorage((state) => state.tabList);
  const addTab = useFlowStorage((state) => state.addTab);
  const navigate = useNavigate();
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
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));
  const toNode = (node) => {
    console.log(node);
    if (!tabList.find((f) => f.id == node.id)) {
      addTab({ id: node.id, title: node.name });
    }
    navigate("/node", { state: node });
  };

  return (
    <Stack direction="column" justifyContent="center" alignItems="center">
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          marginTop: "1vmin",
          marginBottom: "1vmin",
          paddingLeft: 2,
          paddingRight: 2,
          width: "100%",
        }}
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        <Button style={{ color: "black" }}>
          <BsSortDown size={20} style={{ marginRight: "3px" }} />
          <Typography>Newest to oldest</Typography>
        </Button>
      </Stack>
      <Grid
        container
        justifyContent="left"
        sx={{ paddingLeft: 2, paddingRight: 2 }}
        spacing={2}
        columns={15}
      >
        {nodes.map((node, id) => (
          <Grid item xs={3} md={3} key={id}>
            <NodeButton onClick={() => toNode(node)}>
              {/* {t("Last Edit Time:")} {node.time} {t("hours")} */}
            </NodeButton>
            <Typography style={{ fontSize: "14px", paddingTop: "2%" }}>
              {node.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
export default Library;
