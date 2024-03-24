import { Fragment } from "react";
import { styled } from "@mui/material";
import CheckerCard from "./shared/CheckerCard";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" }
}));


export default function Checker() {

  return (
    <Fragment>
      <ContentBox className="ccchecker">
        <CheckerCard />
      </ContentBox>
    </Fragment>
  );
}
