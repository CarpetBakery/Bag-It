import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Item.css";
import TopPanelBar from "../components/TopPanelBar";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Container,
	List,
	ListSubheader,
	ListItemButton,
	ListItemAvatar,
	Avatar,
	ListItemText,
	TextField,
} from "@mui/material";
import TopBar from "../components/TopBar";
import TopContainer from "../components/TopContainer";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Backend } from "../api";

function ExistingBagList({ bags, product }) {
	const [isLoading, setIsLoading] = useState(false);

	async function addToExisting(e, bag) {
		setIsLoading(true);

		await Backend.addItem(product.id, bag.id);
		setIsLoading(false);

		// console.log("Added " + product.name + " to " + bag.title);
	}

	return (
		<List
			sx={{
				width: "100%",
				maxWidth: 360,
				bgcolor: "background.paper",
			}}
			component="nav"
			// aria-labelledby="nested-list-subheader"
			subheader={
				<ListSubheader component="div" id="nested-list-subheader">
					Bags
				</ListSubheader>
			}
		>
			{bags.map((bag) => (
				<ListItemButton disableRipple={true}>
					<ListItemAvatar>
						<Avatar>
							<ShoppingBagOutlinedIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={bag.title}
						secondary={bag.description}
					/>

					{/* Add button */}
					<Button
						variant="contained"
						color="primary"
						onClick={(e) => addToExisting(e, bag)}
						loading={isLoading}
					>
						Add
					</Button>
				</ListItemButton>
			))}
		</List>
	);
}

function NewBagDialog({
	setOpenNewDialog,
	openNewDialog,
	confirmNewBagPressed,
	loading,
}) {
	const [newBagName, setNewBagName] = useState("");
	const [newBagDesc, setNewBagDesc] = useState("");

	return (
		<Dialog
			open={openNewDialog}
			onClose={() => {
				setOpenNewDialog(false);
			}}
		>
			<DialogTitle>Create a New Bag</DialogTitle>
			<DialogContent>
				<p>Here you can create a new bag to add this product to.</p>
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
					loading={loading}
					onClick={() => {
						setOpenNewDialog(false);
					}}
				>
					Cancel
				</Button>
				<Button
					loading={loading}
					onClick={(e) =>
						confirmNewBagPressed(e, newBagName, newBagDesc)
					}
					variant="contained"
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default function Item() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);
	const [bags, setBags] = useState([]);

	const location = useLocation();
	const navigate = useNavigate();
	const product = location.state;
	const [openExistingDialog, setOpenExistingDialog] = useState(false);
	const [openNewDialog, setOpenNewDialog] = useState(false);

	// Redirect if no product data is found
	if (!product) {
		navigate("/products");
		return null;
	}

	useEffect(() => {
		const effect = async () => {
			// See if user is logged in
			let user = await Backend.getCurrentUser();

			if (user == null) {
				setLoggedIn(false);
				return;
			}
			setLoggedIn(true);

			// If so, get bags
			let tempBags = [];
			tempBags = await Backend.getUsersBags(user.id);

			setBags(tempBags);
		};
		effect();
	}, []);

	function openDialog() {
		// console.log("Opened");
		setLoading(false);
	}

	function addExistingBagPressed(e) {
		openDialog();
		setOpenExistingDialog(true);
	}

	function confirmExistingBagPressed(e) {
		setOpenExistingDialog(false);
	}

	function addNewBagPressed(e) {
		openDialog();
		setOpenNewDialog(true);
	}

	async function confirmNewBagPressed(e, newBagName, newBagDesc) {
		setLoading(true);

		// Create the bag
		const bag = await Backend.createNewBag(newBagName, newBagDesc);
		if (bag == null) {
			alert("Please enter a valid name and description.");
			setLoading(false);
			return;
		}

		// Add the item
		await Backend.addItem(product.id, bag.id);

		setOpenNewDialog(false);
		setLoading(false);
	}

	return (
		<Box>
			<TopContainer>
				<TopBar />
				<Container maxWidth="lg">
					<Box
						sx={{
							animation: "fadeIn 0.4s ease-in-out",
						}}
					>
						<div className="ItemContainer">
							{product.image ? (
								<img
									src={product.image}
									alt={product.name}
									className="Image"
								/>
							) : (
								<p>No image available</p>
							)}
						</div>
					</Box>
				</Container>
			</TopContainer>
		</Box>
	);
}
