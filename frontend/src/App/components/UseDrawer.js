import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import MuiDrawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from "@material-ui/core/IconButton";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import Divider from "@material-ui/core/Divider";
import { List, ListItem } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	drawer: {
		background: theme.palette.background.paper,
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9) + 1,
		},
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	// content: {
	// 	flexGrow: 1,
	// 	padding: theme.spacing(3),
	// },
}));

const UseDrawer = (initialDrawer = { open: true, view: "" }) => {
	const [drawer, setDrawer] = useState(initialDrawer);
	return { drawer, setDrawer };
};

const Drawer = ({ drawer, setDrawer, DrawerList }) => {
	const toggalDrawerOpen = () => {
		setDrawer({ ...drawer, open: !drawer.open });
	};
	const theme = useTheme();
	const classes = useStyles();
	return (
		<MuiDrawer
			variant="permanent"
			className={clsx(classes.drawer, {
				[classes.drawerClose]: !drawer.open,
				[classes.drawerOpen]: drawer.open,
			})}
			classes={{
				paper: clsx({
					[classes.drawerOpen]: drawer.open,
					[classes.drawerClose]: !drawer.open,
				}),
			}}
		>
			<div className={classes.toolbar} />
			{DrawerList.map((list, listIndex) => (
				<React.Fragment key={`Fragment-${listIndex}`}>
					<Divider key={`Divider-${listIndex}`} />
					<List key={`listItem-${listIndex}`}>
						{list.map((item, itemIndex) => (
							<ListItem
								key={`listItem-${itemIndex}`}
								button
								onClick={() => {
									setDrawer({ ...drawer, view: item.text });
								}}
							>
								<ListItemIcon key={`listItemIcon-${itemIndex}`}>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									key={`listItemText-${itemIndex}`}
									primary={item.text}
								/>
							</ListItem>
						))}
					</List>
				</React.Fragment>
			))}
			<Divider />
			<div className={classes.toolbar}>
				<IconButton onClick={toggalDrawerOpen}>
					{theme.direction === "rtl" ? (
						drawer.open ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)
					) : drawer.open ? (
						<ChevronLeftIcon />
					) : (
						<ChevronRightIcon />
					)}
				</IconButton>
			</div>
		</MuiDrawer>
	);
};

export { UseDrawer, Drawer };
