import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from "@mui/material";
import { use, useState } from "react";
import { api } from "../../api";
import { Url } from "../../constants";
import { useNavigate } from "react-router";

// Button and Dialog for creating a new bag

function AddBagDialog({ bags, setBags }) {
	const [open, setOpen] = useState(false);
	const [newBagName, setNewBagName] = useState("");
	const [newBagDesc, setNewBagDesc] = useState("");

	// Used to hide the forms when adding a new bag
	const [isAdding, setIsAdding] = useState(false);

	const navigate = useNavigate();

	const openDialog = () => {
		// Show the fields
		setIsAdding(false);

		// Clear fields
		setNewBagName("");
		setNewBagDesc("");
		setOpen(true);
	};

	const closeDialog = () => {
		setOpen(false);
	};

	const submitDialog = async () => {
		// Don't let us submit the dialog if we haven't typed anything
		if (newBagName == "") return;

		setIsAdding(true);

		try {
			// Create new bag in the backend based on the provided text fields
			const res = await api.post(Url.BACKEND_BAG_CREATE, {
				title: newBagName,
				description: newBagDesc,
			});

			// Update the local bags list
			let temp = structuredClone(bags);
			temp.push(res.data);
			setBags(temp);

			// Close the dialog
			setOpen(false);
		} catch (error) {
			alert(error);
		}
	};

	return (
		<>
			<Button variant="contained" onClick={openDialog}>
				+ Create Bag
			</Button>
			<Dialog
				open={open}
				onClose={closeDialog}
				// TODO: Figure out what this two things are
				// aria-labelledby="alert-dialog-title"
				// aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					Create a New Bag
				</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Create the best outfit anyone's ever seen in their life.
					</DialogContentText>
					<TextField
						autoFocus
						required
						margin="dense"
						id="name"
						name="bagname"
						label="Bag Name"
						fullWidth
						variant="standard"
						onChange={(e) => setNewBagName(e.target.value)}
					/>
					<TextField
						required
						margin="dense"
						id="desc"
						name="description"
						label="Description"
						fullWidth
						variant="standard"
						onChange={(e) => {
							let desc = e.target.value;
							if (!desc) desc = "";

							setNewBagDesc(desc);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={closeDialog}
						variant="outlined"
						loading={isAdding}
					>
						Cancel
					</Button>
					<Button
						onClick={submitDialog}
						variant="contained"
						loading={isAdding}
					>
						Create Bag
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default AddBagDialog;
