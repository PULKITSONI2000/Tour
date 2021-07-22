import {
	Avatar,
	Container,
	Grid,
	makeStyles,
	Typography,
	Paper,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getAgency } from "../../services/agecnyServices";
import { isAuthenticated } from "../../services/authServices";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import NewReleasesOutlinedIcon from "@material-ui/icons/NewReleasesOutlined";

import Zoom from "@material-ui/core/Zoom";
import Skeleton from "@material-ui/lab/Skeleton";
import Tooltip from "./Tooltip";

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
	},
}));

const AgencyProfile = () => {
	const [agency, setAgency] = useState({});

	useEffect(() => {
		const getAgencyDetails = async () => {
			try {
				const a = await getAgency(isAuthenticated().agency._id);
				// console.log(a.data);
				setAgency(a.data);
			} catch (error) {
				console.error(error);
			}
		};
		getAgencyDetails();
	}, []);

	const classes = useStyles();
	return (
		<Container maxWidth="lg" className={classes.ContainerRoot}>
			{console.log(agency)}
			{agency ? (
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
							<Typography
								component="h2"
								variant="h4"
								className={classes.myProfile}
							>
								My Profile
							</Typography>
							{agency ? (
								<>
									<Avatar
										alt="Remy Sharp"
										src={agency.agencyAvatarUrl}
										className={classes.avatar}
									/>
									<div className={classes.agencyInfo}>
										<Typography component="h3" variant="h4">
											{agency.agencyName}
											{agency.isVerified ? (
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
									</div>
								</>
							) : (
								<Skeleton variant="circle" width={150} height={150} />
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
				</Grid>
			</Grid>
		</Container>
	);
};

export default AgencyProfile;
