import React, { useState, forwardRef } from "react";
import MuiDialog from "@material-ui/core/Dialog";
// import { makeStyles } from "@material-ui/core/styles";
import { DialogContent, DialogTitle, Paper, Slide } from "@material-ui/core";
import Draggable from "react-draggable";

const UseDialog = (
	initialDialog = {
		open: false,
		title: "",
		children: "",
		maxWidth: "sm",
		fullWidth: true,
		scroll: "body",
	}
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
			scroll={dialog.scroll}
			maxWidth={dialog.maxWidth}
			fullWidth={dialog.fullWidth}
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
