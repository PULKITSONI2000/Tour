import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

// icons
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import LensIcon from "@material-ui/icons/Lens";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { Fab, Slide, useScrollTrigger, Zoom } from "@material-ui/core";

import { connect } from "react-redux";
import { updateTheme } from "../action/theme";
import { isAuthenticated, userSignOut } from "../../services/authServices";

import { withRouter } from "react-router-dom";

import { UseDialog, Dialog } from "./UseDialog";
import UserSignInSignUpForm from "./UserSignInSignUpForm";

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1,
	},
	root: {
		position: "fixed",
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block",
		},
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
		},
	},
	sectionMobile: {
		display: "flex",
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	themeButton: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
			border: `1px solid ${theme.palette.primary.light}`,
			borderRadius: theme.shape.borderRadius,
			marginRight: theme.spacing(2),
			"& button": {
				padding: theme.spacing(1),
			},
		},
	},
	themeButtonMobile: {
		display: "flex",
		border: `1px solid ${theme.palette.primary.light}`,
		borderRadius: theme.shape.borderRadius,
		marginLeft: theme.spacing(1),
		"& button": {
			padding: theme.spacing(1),
		},
	},
}));

const HideOnScroll = ({ children }) => {
	const trigger = useScrollTrigger();

	return <Slide in={!trigger}>{children}</Slide>;
};

const ScrollTop = ({ children }) => {
	const classes = useStyles();
	const trigger = useScrollTrigger({
		target: window,
		disableHysteresis: true,
		threshold: 100,
	});

	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector(
			"#back-to-top-anchor"
		);

		if (anchor) {
			anchor.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	};

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation" className={classes.root}>
				{children}
			</div>
		</Zoom>
	);
};

const Header = ({ history, updateTheme }) => {
	const classes = useStyles();

	const { dialog, setDialog } = UseDialog();

	/*
		NOTE: 
			here anchoreE1 represents state profiles menu anchore
			and mobileMoreAnchorEl represents state when website is opened in small screen like mobile
	 */

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const menuId = "primary-search-account-menu";
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={menuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			{isAuthenticated() ? (
				isAuthenticated().user ? (
					[
						<MenuItem onClick={handleMenuClose} key="UserDashboard">
							Dashboard
						</MenuItem>,
						<MenuItem
							onClick={() => {
								handleMenuClose();
								userSignOut(() => {
									history.push("/");
								});
							}}
							style={{ color: "red" }}
							key="UserSignOut"
						>
							Sign Out
						</MenuItem>,
					]
				) : (
					[
						<MenuItem onClick={handleMenuClose} key="AgencyDashboard">
							Dashboard
						</MenuItem>,
						<MenuItem
							onClick={handleMenuClose}
							style={{ color: "red" }}
							key="AgencySignOut"
						>
							Sign Out
						</MenuItem>,
					]
				)
			) : (
				<MenuItem
					onClick={() => {
						handleMenuClose();

						setDialog({
							...dialog,
							open: true,
							children: (
								<UserSignInSignUpForm
									signInSignUp="Sign In"
									next={() => {
										setDialog({ ...dialog, open: false });
									}}
								/>
							),
						});
					}}
				>
					login
				</MenuItem>
			)}
		</Menu>
	);

	/// for mobile view
	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem>
				<IconButton aria-label="show 4 new mails" color="inherit">
					<Badge badgeContent={4} color="secondary">
						<MailIcon />
					</Badge>
				</IconButton>
				<p>Messages</p>
			</MenuItem>
			<MenuItem>
				<IconButton aria-label="show 11 new notifications" color="inherit">
					<Badge badgeContent={11} color="secondary">
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton
					aria-label="account of current user"
					aria-controls="primary-search-account-menu"
					aria-haspopup="true"
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
			{/* theme */}
			<MenuItem>
				<div className={classes.themeButtonMobile}>
					<IconButton
						aria-label="use dark theme"
						color="inherit"
						onClick={() => {
							updateTheme("dark");
						}}
					>
						<LensIcon
							style={{
								color: "black",
							}}
						/>
					</IconButton>
					<IconButton
						aria-label="use light theme"
						color="inherit"
						onClick={() => {
							updateTheme("light");
						}}
					>
						<LensIcon style={{ color: "white" }} />
					</IconButton>
					<IconButton
						aria-label="use red theme"
						color="inherit"
						onClick={() => {
							updateTheme("red");
						}}
					>
						<LensIcon style={{ color: "red" }} />
					</IconButton>
				</div>
			</MenuItem>
		</Menu>
	);

	return (
		<div className={classes.grow}>
			<HideOnScroll>
				<AppBar>
					<Toolbar>
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="open drawer"
						>
							{/* TODO: currently menu is not working */}
							<MenuIcon />
						</IconButton>
						<Typography className={classes.title} variant="h6" noWrap>
							Material-UI
						</Typography>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<SearchIcon />
							</div>
							<InputBase
								placeholder="Search…"
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ "aria-label": "search" }}
							/>
						</div>
						<div className={classes.grow} />

						{/* theme switcher */}
						<div className={classes.themeButton}>
							<IconButton
								aria-label="use dark theme"
								color="inherit"
								onClick={() => {
									updateTheme("dark");
								}}
							>
								<LensIcon
									style={{
										color: "black",
									}}
								/>
							</IconButton>
							<IconButton
								aria-label="use light theme"
								color="inherit"
								onClick={() => {
									updateTheme("light");
								}}
							>
								<LensIcon style={{ color: "white" }} />
							</IconButton>
							<IconButton
								aria-label="use red theme"
								color="inherit"
								onClick={() => {
									updateTheme("red");
								}}
							>
								<LensIcon style={{ color: "red" }} />
							</IconButton>
						</div>

						<div className={classes.sectionDesktop}>
							<IconButton aria-label="show 4 new mails" color="inherit">
								<Badge badgeContent={4} color="secondary">
									<MailIcon />
								</Badge>
							</IconButton>
							<IconButton
								aria-label="show 17 new notifications"
								color="inherit"
							>
								<Badge badgeContent={17} color="secondary">
									<NotificationsIcon />
								</Badge>
							</IconButton>
							<IconButton
								edge="end"
								aria-label="account of current user"
								aria-controls={menuId}
								aria-haspopup="true"
								onClick={handleProfileMenuOpen}
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
						</div>
						<div className={classes.sectionMobile}>
							<IconButton
								aria-label="show more"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
								color="inherit"
							>
								<MoreIcon />
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				{/* </Slide> */}
			</HideOnScroll>
			<Toolbar id="back-to-top-anchor" />
			<ScrollTop>
				<Fab color="secondary" size="small" aria-label="scroll back to top">
					<KeyboardArrowUpIcon />
				</Fab>
			</ScrollTop>
			{renderMobileMenu}
			{renderMenu}
			<Dialog dialog={dialog} setDialog={setDialog} />
		</div>
	);
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	updateTheme: (theme) => {
		dispatch(updateTheme(theme));
	},
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
