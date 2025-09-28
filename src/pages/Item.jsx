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
	Typography,
	Grid2,
} from "@mui/material";
import TopBar from "../components/TopBar";
import TopContainer from "../components/TopContainer";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Backend } from "../api";
import Footer from "../components/Footer";

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
				<Container
					sx={{
						// marginTop:"40px"
						animation: "fadeIn 0.4s ease-in-out",
					}}
				>
					{product.image && (
						<Box marginTop="100px" marginLeft="50px">
							<Grid2
								container
								alignItems="center"
								justifyContent="center"
								// marginTop="100px"
								// marginLeft="50px"
								display="flex"
							>
								<Grid2
									item
									sx={{
										display: "flex",
									}}
								>
									<Box
									>
										<img
											src={product.image}
											alt={product.name}
											width={"450px"}
										/>
									</Box>
									<Box
										sx={{
											marginTop: "20px",
											marginLeft: "40px",
										}}
									>
										<Typography variant="h3">
											{product.name}
										</Typography>
										<Box sx={{ paddingTop: 2 }}>
											<Typography>
												{product.description}
											</Typography>
										</Box>
										{/* Product Details Section */}
										<Box
											sx={{
												marginTop: 2,
												marginBottom: 3,
												// background: "#181824",
												borderRadius: 2,
												boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
												padding: 2,
												paddingLeft: 0,
												maxWidth: 400,
												color: "#e0e0e0",
												// border: "1px solid #23233a",
											}}
										>
											<Typography variant="h6" fontWeight="bold" sx={{}} gutterBottom>
												Product Details
											</Typography>
											<Grid2 container spacing={1}>
												<Grid2 item xs={6}><Typography variant="body2" sx={{ color: "#b0b0b0" }}>Size:</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>{
													{
														0: "Extra Small",
														1: "Small",
														2: "Medium",
														3: "Large",
														4: "Extra Large",
													}[product.size] || "N/A"
												}</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" sx={{ color: "#b0b0b0" }}>Type:</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>{
													{
														0: "Shorts",
														1: "Pants",
														2: "T-Shirt",
														3: "Dress",
														4: "Shoes",
														5: "Hat",
														6: "Hoodie",
														7: "Shirt",
													}[product.type] || "N/A"
												}</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" sx={{ color: "#b0b0b0" }}>Color:</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>{product.color || "N/A"}</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" sx={{ color: "#b0b0b0" }}>Gender:</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>{
													{ 0: "Male", 1: "Female", 2: "Unisex" }[product.gender] || "N/A"
												}</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" sx={{ color: "#b0b0b0" }}>Brand:</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>{product.brand || "N/A"}</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" sx={{ color: "#b0b0b0" }}>Product ID:</Typography></Grid2>
												<Grid2 item xs={6}><Typography variant="body2" fontWeight="bold" sx={{ color: "#fff" }}>{product.id}</Typography></Grid2>
											</Grid2>
										</Box>
										{loggedIn && (
											<Box
												sx={{
													marginTop: "20px",
													marginBottom: "20px",
												}}
											>
												<Button
													variant="contained"
													onClick={
														addExistingBagPressed
													}
													className="addToExistingButton"
												>
													Add to Bag
												</Button>
											</Box>
										)}
									</Box>
									<Box></Box>
								</Grid2>
							</Grid2>
						</Box>
					)}

					{loggedIn && (
						<div className="addButtons">
							<div className="existing">
								{/* Existing bag dialog */}
								<Dialog
									open={openExistingDialog}
									onClose={() => setOpenExistingDialog(false)}
								>
									<DialogTitle>Select a Bag</DialogTitle>
									<DialogContent>
										<p>
											Select an existing bag to add this
											product to.
										</p>
										<ExistingBagList
											bags={bags}
											product={product}
										/>
									</DialogContent>
									<DialogActions>
										<Button
											loading={loading}
											onClick={() =>
												setOpenExistingDialog(false)
											}
										>
											Cancel
										</Button>
									</DialogActions>
								</Dialog>
							</div>
						</div>
					)}
				</Container>
				<Footer />
			</TopContainer>
		</Box>
	);
}
