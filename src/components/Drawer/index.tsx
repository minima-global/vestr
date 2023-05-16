import { Stack, Toolbar } from "@mui/material";
import {
  NoteAddOutlined,
  CalculateOutlined,
  HomeOutlined,
  LocationSearchingOutlined,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import Backdrop from "../Backdrop";
import "./drawer.css";
import useChainHeight from "../../hooks/useChainHeight";

interface IProps {
  open: boolean;
  closeDrawer: () => void;
}
const Drawer = ({ open, closeDrawer }: IProps) => {
  const tip = useChainHeight();
  let drawerClasses = ["drawer-temporary"];
  if (open) {
    drawerClasses = ["drawer-temporary", "open"];
  }

  return (
    <>
      {open && <Backdrop close={closeDrawer} />}
      <div className={drawerClasses.join(" ")}>
        <Toolbar className="toolbar">
          <Stack
            rowGap={0.1}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <img src="./assets/icon.png" />
            <h6>Vestr</h6>
          </Stack>
        </Toolbar>
        <Stack mt={2} gap={2}>
          <Stack className="navigation" ml={3} mr={3} gap={2}>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/"
              onClick={closeDrawer}
            >
              <HomeOutlined />
              Home
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/calculate"
              onClick={closeDrawer}
            >
              <CalculateOutlined />
              Calculate
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/createnew"
              onClick={closeDrawer}
            >
              <NoteAddOutlined />
              Create
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/track"
              onClick={closeDrawer}
            >
              <LocationSearchingOutlined />
              Track
            </NavLink>
          </Stack>
        </Stack>
      </div>

      <div className="drawer-persistent">
        <Toolbar className={"toolbar"}>
          <Stack
            rowGap={0.1}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <img src="./assets/icon.png" />
            <h6>Vestr</h6>
          </Stack>
        </Toolbar>
        <Stack mt={2} gap={2}>
          <Stack className={"navigation"} ml={3} mr={3} gap={2}>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/"
            >
              <HomeOutlined />
              Home
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/calculate"
            >
              <CalculateOutlined />
              Calculate
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/createnew"
            >
              <NoteAddOutlined />
              Create
            </NavLink>
            <NavLink
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
              to="/dashboard/track"
            >
              <LocationSearchingOutlined />
              Track
            </NavLink>
          </Stack>
        </Stack>
      </div>
    </>
  );
};

export default Drawer;
