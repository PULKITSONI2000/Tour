import React, { useState, forwardRef } from "react";
import MuiDialog from "@material-ui/core/Dialog";
// import { makeStyles } from "@material-ui/core/styles";
import { DialogContent, DialogTitle, Paper, Slide } from "@material-ui/core";
import Draggable from "react-draggable";

// const useStyles = makeStyles((theme) => ({
// 	modal: {
// 		display: "flex",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		borderRadius: theme.spacing(5),
// 	},
// 	paper: {
// 		border: `2px solid ${theme.palette.primary.main}`,
// 		borderRadius: theme.spacing(2),
// 		boxShadow: theme.shadows[5],
// 		padding: theme.spacing(2, 4, 3),
// 	},
// }));

const UseDialog = (
	initialDialog = { open: false, title: "", children: "" }
) => {
	const [dialog, setDialog] = useState(initialDialog);

	return { dialog, setDialog };
};

const PaperComponent = (props) => {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
};
const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Dialog = ({ dialog, setDialog }) => {
	// const classes = useStyles();
	const handleClose = () => {
		setDialog({ ...dialog, open: false });
	};
	return (
		<MuiDialog
			open={dialog.open}
			onClose={handleClose}
			TransitionComponent={Transition}
			PaperComponent={PaperComponent}
			aria-labelledby="draggable-dialog-title"
			scroll="body"
		>
			{dialog.title && (
				<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
					{dialog.title}
				</DialogTitle>
			)}
			<DialogContent dividers={true}>{dialog.children}</DialogContent>
		</MuiDialog>
	);
};
export { UseDialog, Dialog };
