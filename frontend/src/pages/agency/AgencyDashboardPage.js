import React from "react";
import { makeStyles } from "@material-ui/core";
import { UseDrawer, Drawer } from "../../App/components/UseDrawer";

import AgencyProfile from "../../App/components/AgencyProfile";
import AgencyDetails from "../../App/components/AgencyDetails";
import AgencyTour from "../../App/components/AgencyTour";
import AgencyAddTour from "../../App/components/AgencyAddTour";
import AgencyUpdateTour from "../../App/components/AgencyUpdateTour";
import AgencyInbox from "../../App/components/AgencyInbox";
import AgencyBooking from "../../App/components/AgencyBooking";

import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import EditIcon from "@material-ui/icons/Edit";
import EmailIcon from "@material-ui/icons/Email";
import EditLocationRoundedIcon from "@material-ui/icons/EditLocationRounded";
import AddLocationRoundedIcon from "@material-ui/icons/AddLocationRounded";
import NaturePeopleIcon from "@material-ui/icons/NaturePeople";
import ViewListRoundedIcon from "@material-ui/icons/ViewListRounded";

const useStyles = makeStyles((theme) => ({
	containerRoot: ({ open }) => ({
		minHeight: "calc(100vh - 64px)",
		"& main": {
			flexGrow: 1,

			marginLeft: open ? "240px" : theme.spacing(9) + 1,
			transition: theme.transitions.create(["width", "margin"], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			[theme.breakpoints.down("sm")]: {
				marginLeft: open ? "240px" : theme.spacing(7) + 1,
			},
		},
	}),
}));

const SwitchSection = (section) => {
	switch (section) {
		case "":
			return <AgencyProfile />;
		case "Profile":
			return <AgencyProfile />;
		case "Details":
			return <AgencyDetails />;
		case "Tour":
			return <AgencyTour />;
		case "AddTour":
			return <AgencyAddTour />;
		case "UpdateTour":
			return <AgencyUpdateTour />;
		case "Bookings":
			return <AgencyBooking />;
		case "InboxNotification":
			return <AgencyInbox />;
		default:
			return <h1>Error</h1>;
	}
};

const AgencyDashboardPage = () => {
	const { drawer, setDrawer } = UseDrawer({ open: true, section: "" });
	const classes = useStyles({ open: drawer.open });

	const DrawerList = [
		[
			{ icon: <AccountCircleIcon fontSize="large" />, text: "Profile" },
			{ icon: <EditIcon fontSize="large" />, text: "Details" },
			{
				icon: <EmailIcon fontSize="large" />,
				text: "InboxNotification",
			},
			{ icon: <ViewListRoundedIcon fontSize="large" />, text: "Bookings" },
		],
		[
			{ icon: <NaturePeopleIcon fontSize="large" />, text: "Tour" },
			{ icon: <AddLocationRoundedIcon fontSize="large" />, text: "AddTour" },
			{
				icon: <EditLocationRoundedIcon fontSize="large" />,
				text: "UpdateTour",
			},
		],
	];

	return (
		<div className={classes.containerRoot}>
			<Drawer drawer={drawer} setDrawer={setDrawer} DrawerList={DrawerList} />

			<main>{SwitchSection(drawer.section)}</main>
		</div>
	);
};

export default AgencyDashboardPage;
