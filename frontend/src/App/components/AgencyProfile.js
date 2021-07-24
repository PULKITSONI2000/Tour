import {
	Avatar,
	Container,
	Grid,
	makeStyles,
	Typography,
	Paper,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getAgency } from "../../services/agecnyServices";
import { isAuthenticated } from "../../services/authServices";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import NewReleasesOutlinedIcon from "@material-ui/icons/NewReleasesOutlined";
import EditIcon from "@material-ui/icons/Edit";

import Zoom from "@material-ui/core/Zoom";
import Skeleton from "@material-ui/lab/Skeleton";
import Tooltip from "./Tooltip";
import Controls from "../components/controls/Controls";

const useStyles = makeStyles((theme) => ({
	greetingTypography: {
		fontSize: theme.spacing(4),
		fontWeight: "Bold",
		letterSpacing: "2px",
		color: theme.palette.primary.main,
		"& span": {
			color: theme.palette.secondary.main,
		},
		[theme.breakpoints.down("sm")]: {
			fontSize: theme.spacing(3),
		},
	},
	ContainerRoot: {
		marginTop: theme.spacing(4),
		[theme.breakpoints.down("lg")]: {
			maxWidth: "95%",
		},
	},
	sectionBlock: {
		padding: theme.spacing(3),
		borderRadius: theme.spacing(2),
		"& + .MuiPaper-root ": {
			marginTop: theme.spacing(5),
		},
	},
	sectionGrid: {
		flexGrow: 1,
	},
	avatar: {
		width: "150px",
		height: "150px",
		background: theme.palette.secondary.light,
	},
	components: {
		paddingTop: theme.spacing(2),
		flexGrow: 1,
	},
	earningText: {
		fontSize: theme.spacing(3),
		color: theme.palette.primary.main,
		"& + h3": {
			color: theme.palette.success.main,
			fontWeight: "Bold",
			fontSize: theme.spacing(8),
		},
	},
	myProfile: {
		marginBottom: theme.spacing(3),
		fontSize: theme.spacing(5),
		color: theme.palette.primary.main,
	},
	agencyInfo: {
		marginTop: theme.spacing(3),
		"& h3": {
			marginBottom: theme.spacing(1),
			textAlign: "center",
			color: theme.palette.secondary.main,
			"& .verified": {
				color: theme.palette.success.main,
			},
			"& .unverified": {
				color: theme.palette.warning.main,
			},
		},
		"& div": {
			textAlign: "center",
		},
		"& #profileButton": {
			marginTop: theme.spacing(2),
		},
	},
	bookingList: {
		width: "100%",
		maxWidth: "36ch",
		backgroundColor: theme.palette.background.paper,
	},
}));

/*
	TODO:  Skeleton
 */
const AgencyProfile = ({ drawer, setDrawer }) => {
	const [agency, setAgency] = useState({});

	const getAgencyDetails = async () => {
		try {
			const a = await getAgency(isAuthenticated().agency._id);
			setAgency(a.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getAgencyDetails();
	}, []);
	const classes = useStyles();
	return (
		<Container maxWidth="lg" className={classes.ContainerRoot}>
			{agency.agencyName ? (
				<Typography variant="h1" className={classes.greetingTypography}>
					Hello, <span>{agency.agencyName}</span>
				</Typography>
			) : (
				<Skeleton variant="text" width={300} height={50} />
			)}
			<Grid
				container
				direction={"row-reverse"}
				justify="center"
				alignItems="flex-start"
				className={classes.components}
				spacing={6}
			>
				<Grid
					item
					component="section"
					sm={12}
					md={4}
					className={classes.sectionGrid}
				>
					<Paper className={classes.sectionBlock}>
						<Grid
							container
							alignItems="center"
							justify="space-evenly"
							direction="column"
						>
							{agency.agencyName ? (
								<>
									<Typography
										component="h2"
										variant="h4"
										className={classes.myProfile}
									>
										My Profile
									</Typography>

									<Avatar
										alt="Remy Sharp"
										src={agency.agencyAvatarUrl}
										className={classes.avatar}
									/>
									<div className={classes.agencyInfo}>
										<Typography component="h3" variant="h4">
											{agency.agencyName}
											{agency && agency.isVerified ? (
												<Tooltip
													arrow
													classes={classes.BootstrapTooltip}
													TransitionComponent={Zoom}
													enterDelay={250}
													leaveDelay={200}
													title={<h2>Verified</h2>}
												>
													<VerifiedUserOutlinedIcon className="verified" />
												</Tooltip>
											) : (
												<Tooltip
													arrow
													// classes={classes.BootstrapTooltip}
													title={<h2>Unverified</h2>}
													TransitionComponent={Zoom}
													enterDelay={250}
													leaveDelay={200}
												>
													<NewReleasesOutlinedIcon className="unverified" />
												</Tooltip>
											)}
										</Typography>
										<Typography component="div" variant="subtitle1">
											{agency.email}
										</Typography>
										<Typography component="div" variant="subtitle1">
											{agency.phone}
										</Typography>

										<div id="profileButton">
											<Controls.Button
												variant="outlined"
												color="primary"
												text={<EditIcon color={"primary"} />}
												size="medium"
												onClick={() =>
													setDrawer({
														...drawer,
														view: "Details",
														details: { show: "Edit Profile", data: agency },
													})
												}
											/>
											<Controls.Button
												variant="outlined"
												color="primary"
												text="View Profile"
												size="medium"
												onClick={() =>
													setDrawer({
														...drawer,
														view: "Details",
														details: { show: "View Profile", data: agency },
													})
												}
											/>
										</div>
									</div>
								</>
							) : (
								<>
									<Skeleton
										variant="text"
										width={150}
										height={55}
										className={classes.myProfile}
									/>
									<Skeleton variant="circle" width={150} height={150} />
								</>
							)}
						</Grid>
					</Paper>
				</Grid>
				<Grid
					item
					component="section"
					sm={12}
					md={8}
					className={classes.sectionGrid}
				>
					<Paper className={classes.sectionBlock}>
						<Typography variant="h2" className={classes.earningText}>
							Balance:
						</Typography>
						<Typography component="h3">{agency.totEarning || 0} ₹</Typography>
					</Paper>

					<Paper className={classes.sectionBlock}>
						{/*
							TODO: complete when it have some booking
						 */}
						<Typography variant="h2" className={classes.earningText}>
							Bookings:
						</Typography>
						<div>
							{agency.bookings && agency.bookings.length !== 0 ? (
								<List className={classes.bookingList}>
									{agency.bookings.map((listItem, index) => (
										<ListItem alignItems="flex-start" key={`listItem-${index}`}>
											<ListItemAvatar>
												<Avatar alt="booking" src={agency.agencyAvatarUrl} />
											</ListItemAvatar>
											<ListItemText
												primary={
													<>
														<Typography>{agency.agencyName}</Typography>
													</>
												}
												secondary={
													<>
														<Typography>{agency.agencyName}</Typography>
													</>
												}
											/>
										</ListItem>
									))}
								</List>
							) : (
								<Typography align="center" variant="h4" color="textSecondary">
									Relax, you don't have any booking
								</Typography>
							)}
						</div>
					</Paper>
					<Paper className={classes.sectionBlock}>
						{/*
							TODO: complete when it have some notification
						 */}
						<Typography variant="h2" className={classes.earningText}>
							Inbox Notifications:
						</Typography>
						<div>
							{agency.inboxNotification &&
							agency.inboxNotification.length !== 0 ? (
								<List className={classes.bookingList}>
									{agency.inboxNotification.map((listItem, index) => (
										<ListItem alignItems="flex-start" key={`listItem-${index}`}>
											<ListItemAvatar>
												<Avatar alt="booking" src={agency.agencyAvatarUrl} />
											</ListItemAvatar>
											<ListItemText
												primary={
													<>
														<Typography>{agency.agencyName}</Typography>
													</>
												}
												secondary={
													<>
														<Typography>{agency.agencyName}</Typography>
													</>
												}
											/>
										</ListItem>
									))}
								</List>
							) : (
								<Typography align="center" variant="h4" color="textSecondary">
									Don't recieved any message yet
								</Typography>
							)}
						</div>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default AgencyProfile;
