import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const Sidebar = ({ endpoints }: any) => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {endpoints.map((endpoint: any, index: any) => (
          <Link href={endpoint.path} passHref key={index}>
            <ListItem component="a">
              <ListItemIcon>{endpoint.icon}</ListItemIcon>
              <ListItemText primary={endpoint.label} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
