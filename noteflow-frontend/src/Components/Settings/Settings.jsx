import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BsFillPersonFill } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineMail } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { useFlowStorage } from "../../storage/Storage";
const Settings = () => {
  const { t, i18n } = useTranslation();
  const lang = useFlowStorage((state) => state.lang);
  const setLang = useFlowStorage((state) => state.setLang);
  const SettingsButton = styled(Button)(({ theme }) => ({
    cursor: "pointer",
    backgroundColor: "#0e1111",
    color: "white",
    width: "25vmin",
    variant: "outlined",
    ":hover": {
      backgroundColor: "lightgrey",
    },
  }));
  const changeLang = () => {
    i18n.changeLanguage(lang);
    if (lang === "zh") {
      setLang("en");
    } else {
      setLang("zh");
    }
  };
  return (
    <Grid container columns={12} sx={{ height: "100%" }}>
      <Grid item xs={7}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <div
            style={{
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              border: "2px solid black",
              overflow: "hidden",
            }}
          >
            <BsFillPersonFill
              color="black"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </Stack>
      </Grid>
      <Grid item xs={5}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="left"
          sx={{ height: "100%", gap: "2vmin" }}
        >
          <Typography sx={{ fontSize: "24px", marginBottom: "10px" }}>
            Lawrence Tsai
          </Typography>

          <Stack direction="row" justifyContent="left" alignItems="center">
            <AiOutlineMail
              size={25}
              style={{ marginRight: "15px" }}
            ></AiOutlineMail>
            <Typography>lawrence@gmail.com</Typography>
          </Stack>
          <Stack direction="row" justifyContent="left" alignItems="center">
            <RiLockPasswordLine
              size={25}
              style={{ marginRight: "15px" }}
            ></RiLockPasswordLine>
            <SettingsButton>{t("Reset Password")}</SettingsButton>
          </Stack>
          <Stack direction="row" justifyContent="left" alignItems="center">
            <MdLanguage size={25} style={{ marginRight: "15px" }}></MdLanguage>
            <SettingsButton onClick={() => changeLang()}>
              {t("Switch to " + (lang === "zh" ? "Chinese" : "English"))}
            </SettingsButton>
          </Stack>
          <Stack direction="row" justifyContent="left" alignItems="center">
            <BiLogOut size={25} style={{ marginRight: "15px" }}></BiLogOut>
            <SettingsButton>{t("Log out")}</SettingsButton>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
export default Settings;
