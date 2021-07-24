import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Avatar,
	Badge,
	Container,
	Divider,
	IconButton,
	Paper,
	Typography,
} from "@material-ui/core";
import { isAuthenticated } from "../../services/authServices";
import { getAgency } from "../../services/agecnyServices";
import PhotoCameraRoundedIcon from "@material-ui/icons/PhotoCameraRounded";
import Skeleton from "@material-ui/lab/Skeleton";
import AgencyUpdateDetailsForm from "./AgencyUpdateDetailsForm";
import AgencyUpdatePasswordForm from "./AgencyUpdatePasswordForm";
const useStyles = makeStyles((theme) => ({
	ContainerRoot: {
		marginTop: theme.spacing(4),
		[theme.breakpoints.down("lg")]: {
			maxWidth: "95%",
		},
	},
	showTypography: {
		fontSize: theme.spacing(4),
		fontWeight: "Bold",
		letterSpacing: "2px",
		color: theme.palette.primary.main,
		marginBottom: theme.spacing(2),
		[theme.breakpoints.down("sm")]: {
			fontSize: theme.spacing(3),
		},
	},
	sectionBlock: {
		padding: theme.spacing(3),
		borderRadius: theme.spacing(2),
		"& + .MuiPaper-root ": {
			marginTop: theme.spacing(5),
		},
	},
	avatorButtom: {
		display: "none",
	},
	avatar: {
		width: "150px",
		height: "150px",
		background: theme.palette.secondary.light,
	},
	avatarEditIcon: {
		color: theme.palette.primary.main,
		fontSize: theme.spacing(6),
		background: theme.palette.background.default,
		border: `1px ${theme.palette.primary.dark} solid`,
		borderRadius: 50,
		padding: 9,
	},
	dividerRoot: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
	},
}));

const AgencyDetails = ({ drawer, setDrawer }) => {
	const { token, agency } = isAuthenticated();
	const getAgencyDetails = async () => {
		try {
			const a = await getAgency(isAuthenticated().agency._id);
			a.data = {
				...a.data,
				tourProvides: undefined,
				bookings: undefined,
				isVarified: undefined,
				totalEarning: undefined,
				inboxNotification: undefined,
				showPassword: false,
			};
			setDrawer({
				...drawer,
				details: {
					...drawer.details,
					show: drawer.details.show || "view",
					data: a.data,
				},
			});
		} catch (error) {
			console.error(error);
		}
	};
	Object.keys(drawer.details.data).length === 0 && getAgencyDetails();

	const classes = useStyles();
	return (
		<Container maxWidth="lg" className={classes.ContainerRoot}>
			{drawer.details.data.agencyName ? (
				<Typography
					component="h2"
					variant="h4"
					className={classes.showTypography}
				>
					{drawer.details.show === "view" ? "View Profile" : "Edit Profile"}
				</Typography>
			) : (
				<Skeleton variant="text" width={300} height={50} />
			)}

			<Paper className={classes.sectionBlock}>
				<section id="updateAgencyAvatar">
					<Badge
						overlap="circle"
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						badgeContent={
							<>
								<input
									accept="image/*"
									className={classes.avatorButtom}
									id="icon-button-file"
									type="file"
								/>
								<label htmlFor="icon-button-file">
									<IconButton
										color="primary"
										aria-label="upload picture"
										component="span"
									>
										<PhotoCameraRoundedIcon
											className={classes.avatarEditIcon}
										/>
									</IconButton>
								</label>
							</>
						}
					>
						{/*
						TODO: add image upload image
					 */}
						<Avatar
							alt="Agency Avatar"
							src={drawer.details.data.agencyAvatarUrl}
							className={classes.avatar}
						/>
					</Badge>
				</section>
				<Divider variant="middle" classes={{ root: classes.dividerRoot }} />
				<section id="updateAgencyDetails">
					{drawer.details.data.agencyName ? (
						<AgencyUpdateDetailsForm
							initialFValues={{
								...drawer.details.data,
								agencyAvatarUrl: undefined,
								agencyCertifications: undefined,
								bookings: undefined,
								inboxNotification: undefined,
								isVarified: undefined,
								role: undefined,
								showPassword: undefined,
								totalEarning: undefined,
								tourProvides: undefined,
							}}
							token={token}
							agencyId={agency._id}
						/>
					) : (
						<Skeleton variant="rect" width={200} height={200} />
					)}
				</section>
				<Divider variant="middle" classes={{ root: classes.dividerRoot }} />
				<section id="updateAgencyPassword">
					{drawer.details.data.agencyName ? (
						<AgencyUpdatePasswordForm token={token} agencyId={agency._id} />
					) : (
						<Skeleton variant="rect" width={200} height={200} />
					)}
				</section>
			</Paper>
		</Container>
	);
};

export default AgencyDetails;
