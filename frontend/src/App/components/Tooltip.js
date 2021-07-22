import React from "react";
import MuiTooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core";

const useStylesBootstrap = makeStyles((theme) => ({
	arrow: {
		color: theme.palette.common.black,
	},
	tooltip: {
		backgroundColor: theme.palette.common.black,
		borderRadius: theme.spacing(2),
		padding: `5px ${theme.spacing(3)}px`,
	},
}));
const BootstrapTooltip = (props) => {
	const classes = useStylesBootstrap();

	return <MuiTooltip arrow classes={classes} {...props} />;
};

const Tooltip = ({ title, children }) => {
	return <BootstrapTooltip title={title}>{children}</BootstrapTooltip>;
};

export default Tooltip;
