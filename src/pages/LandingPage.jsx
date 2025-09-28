import {
	autocompleteClasses,
	Box,
	Button,
	ButtonGroup,
	Card,
	CardContent,
	Container,
	Grid2,
	Icon,
	Typography,
	useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { styled, alpha } from "@mui/material/styles";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import "../styles/Landing.css";

import bagitLogo from "../assets/bagit_shadow.svg";
import TopBar from "../components/TopBar";
import pearLogo from "../assets/pear_outline_white.svg";
import { Link, useNavigate } from "react-router";
import { Url } from "../constants";
import { Backend } from "../api";
import Footer from "../components/Footer";

const StyledBox = styled(Box)(({ theme }) => ({
	borderRadius: (theme.vars || theme).shape.borderRadius,
	outline: "6px solid",
	display: "flex",

	padding: "20px",

	backgroundSize: "cover",
	boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
	outlineColor: "hsla(220, 20%, 42%, 0.1)",

	borderColor: (theme.vars || theme).palette.grey[700],
}));

function LandingPage() {
	const scrollText = keyframes`
  0% { left: 100%; }
  100% { left: -100%; }
`;

	const navigate = useNavigate();
	const test = [1, 2, 3];
	const [items, setItems] = useState([]);

	const [loggedIn, setLoggedIn] = useState(false);
	const [gettingItems, setGettingItems] = useState(false);

	// Stupid way to use async function inside effect
	useEffect(() => {
		const effect = async () => {
			let temp = await Backend.verifyUser();
			setLoggedIn(temp);

			getItems();
		};
		effect();
	}, []);

	const getItems = async () => {
		if (gettingItems) return;

		setGettingItems(true);

		try {
			let fetchedItems = [];
			const maxAttempts = 50; // Limit attempts to avoid infinite loops
			let attempts = 0;
			console.log("trying to load items");
			while (fetchedItems.length < 3 && attempts < maxAttempts) {
				const randomId = Math.floor(Math.random() * 100) + 1; // Adjust range as needed
				attempts++;
				// console.log("trying..." + randomId);

				try {
					// Fetch product using Backend API
					const item = await Backend.getClothingItem(randomId);

					if (item == null) continue;

					// Ensure no duplicate items are added
					// if (item && !fetchedItems.some((fetchedItem) => fetchedItem.id === item.id)) {
					if (item && !fetchedItems.includes(item)) {
						fetchedItems.push(item);
						// console.log(fetchedItems);
						// console.log("Got an item!");
					}
				} catch (err) {
					console.warn(`Item with ID ${randomId} not found.`);
				}
			}

			setItems(fetchedItems);
		} catch (err) {
			alert("Error loading items: " + err.message);
		}

		setGettingItems(false);
	};
	async function verifyUser() {
		let temp = await Backend.verifyUser();
		setLoggedIn(temp);

		if (temp) {
			console.log("User is logged in");
		} else {
			console.log("User is not logged in");
		}
	}

	function getStartedPressed(e) {
		if (!loggedIn) navigate(Url.REGISTER);
		else navigate(Url.PROFILE);
	}

	function loginPressed(e) {
		if (!loggedIn) navigate(Url.LOGIN);
		else navigate(Url.PROFILE);
	}

	function seeAllPressed(e) {
		navigate(Url.FEED);
	}

	return (
		<Box>
			<Box
				sx={(theme) => ({
					bgcolor: "#080029ff",
					minHeight: "100vh",
					color: "#d5d6dfff",
					padding: "2rem 0",

					width: "100%",
					backgroundRepeat: "no-repeat",
					backgroundImage:
						"radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
					...theme.applyStyles("dark", {
						backgroundImage:
							"radial-gradient(ellipse 80% 50% at 50% -20%, hsla(310, 94.00%, 26.10%, 0.67), transparent)",
						// "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 94.00%, 26.10%), transparent)",
					}),
				})}
			>
				<Container maxWidth="lg">
					<TopBar loggedIn={loggedIn} />
					<Grid2
						container
						spacing={20}
						alignContent="center"
						justifyContent="flex-start"
						// justifyContent="space-between"

						sx={{
							marginTop: "80px",
							animation: "fadeIn 0.5s ease-in-out",
						}}
					>
						<Grid2
							item
							display="flex"
							alignItems="center"
							xs={12}
							md={6}
							marginLeft={7}
						>
							<Box
								sx={{
									filter: "drop-shadow(0 0 70px rgba(132, 0, 255, 0.27))",
									// marginTop: "-10px"
								}}
							>
								<Typography
									variant="h2"
									fontWeight="bold"
									sx={{
										background:
											"linear-gradient(177deg,rgb(68, 245, 127),rgb(0, 157, 219))",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
									}}
								>
									Bag-It
								</Typography>
								<Typography
									variant="h2"
									fontWeight="bold"
									mt={1}
								>
									Find Your Next Fit.
								</Typography>
								<Typography variant="h4" mt={2} color="gray">
									Fashion Database Excellence.
								</Typography>
							</Box>
						</Grid2>
						<Grid2
							item
							display="flex"
							alignItems="center"
							xs={12}
							md={6}
						>
							<Box
								component="img"
								src={bagitLogo}
								alt="Bag-It Logo"
								sx={{
									width: "350px",
									filter: "drop-shadow(0 0 80px rgba(132, 0, 255, 0.36))",
									marginTop: "30px",
								}}
							/>
						</Grid2>
					</Grid2>
					<Grid2
						container
						spacing={2}
						display="flex"
						alignItems="flex-start"
						marginTop="-50px"
						marginLeft={7}
						sx={{
							animation: "fadeIn 0.8s ease-in-out",
						}}
					>
						<Grid2 item>
							{" "}
							<Button
								variant="contained"
								color="primary"
								sx={{
									borderRadius: 28,
									textTransform: "none",
									paddingY: "10px",
								}}
								onClick={getStartedPressed}
							>
								<Typography fontWeight="bold">
									Get Started
								</Typography>
							</Button>
						</Grid2>
						<Grid2 item>
							{" "}
							<Button
								variant="outlined"
								sx={{
									borderRadius: 28,
									textTransform: "none",
									paddingY: "10px",
									paddingX: "20px",
								}}
								onClick={loginPressed}
							>
								<Typography fontWeight="bold">Login</Typography>
							</Button>
						</Grid2>
					</Grid2>
					<Box
						sx={{
							// padding: 2,
							paddingTop: 10,
							animation: "fadeIn 1s ease-in-out",
						}}
					>
						<Box
							display="flex"
							alignContent="center"
							sx={(theme) => ({
								color: "secondary.main",
							})}
							margin={2}
						>
							<WhatshotIcon fontSize="large" />
							<Typography
								variant="h5"
								display="flex"
								fontWeight="bold"
								margin={0.5}
								color="text.default"
							>
								The hottest items today
							</Typography>
							<Button
								onClick={seeAllPressed}
								variant="contained"
								color="secondary"
								sx={{
									// padding: 2,
									marginLeft: "10px",
								}}
							>
								See All
							</Button>
						</Box>
					</Box>

					{!items && (
						<Box marginBottom="500px">
							<Typography>ok</Typography>
						</Box>
					)}

					{items.length > 0 && (
						<Grid2
							container
							spacing={4}
							padding={2}
							marginTop={2}
							sx={{
								animation: "fadeIn 0.7s ease-in-out",
							}}
						>
							{items.map((item) => (
								<Grid2
									size={{ xs: 12, sm: 6, md: 4 }}
									key={item.id}
									sx={{ display: "flex" }}
								>
									<Link to="/item" state={{ ...item }}>
										<Card
											variant="contained"
											sx={(theme) => ({
												display: "flex",
												flexDirection: "column",
												justifyContent: "space-between",
												flexGrow: 1,
												bgcolor: "background.default",

												borderRadius: (
													theme.vars || theme
												).shape.borderRadius,
												outline: "6px solid",
												backgroundSize: "cover",
												boxShadow:
													"0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
												outlineColor:
													"hsla(220, 20%, 42%, 0.1)",
												borderColor: (
													theme.vars || theme
												).palette.grey[700],
											})}
										>
											<CardContent
												sx={{
													padding: "20px",
													flexGrow: 1,
												}}
											>
												{/* <span className="productPageLink"></span> */}
												<Typography variant="h5">
													{item.name ||
														`Clothing Item #${item.id}`}
												</Typography>
												<Grid2
													container
													alignItems="center"
													justifyContent="center"
													display="flex"
													sx={{
														marginTop: "10px",
														height: "250px",
													}}
												>
													<Grid2 item>
														<Box
															component="img"
															src={item.image}
															alt={
																item.name ||
																`Clothing Item #${item.id}`
															}
															sx={{
																maxWidth:
																	"100%",
																maxHeight:
																	"100%",
																width: "auto",
																height: "auto",
																objectFit:
																	"contain",
																display:
																	"block",
																margin: "0 auto",
																padding: "2px",
															}}
														/>
													</Grid2>
												</Grid2>
												<Typography
													variant="body1"
													gutterBottom
													marginTop={1}
													sx={{
														color: "text.secondary",
													}}
												>
													{/* {item.description || "No description available."} */}
												</Typography>
											</CardContent>
											<Box
												sx={{
													display: "flex",
													justifyContent: "flex-end",
													padding: "10px 20px",
												}}
											>
												<Button
													variant="outlined"
													sx={{
														// justifyContent: "flex-end",
														marginTop: 18,
													}}
												>
													<Link
														to="/item"
														state={{ ...item }}
													>
														<span className="productPageLink"></span>
													</Link>
													More Info
												</Button>
											</Box>
										</Card>
									</Link>
								</Grid2>
							))}

							<Container
								maxWidth="lg"
								sx={{
									animation: "fadeIn 0.4s ease-in-out",
								}}
							>
								<Box
									sx={{
										marginTop: 7,
									}}
								>
									<Box display="flex">
										<Box
											component="img"
											src={pearLogo}
											alt="Pear Logo"
											sx={{
												width: "50px",
												marginRight: "15px",
												marginTop: "-30px",
												filter: "drop-shadow(0 0 10px rgb(68, 55, 255))",
											}}
										/>
										<Typography
											variant="h4"
											fontWeight="bold"
											marginBottom={3}
										>
											About Us
										</Typography>
									</Box>

									<Typography
										fontWeight="bold"
										display="flex"
										variant="h5"
									>
										We are Peartech™!
									</Typography>
									<Typography>
										Our company aims to give users an
										experience they shall never forget...
										<br />
										We hope that you continue to shop with
										us!
										<br />
										<br />
										Enjoy the sights! Enjoy the sounds!
										<Grid2
											container
											spacing={4}
											marginTop={4}
										>
											{[
												{
													icon: "💡",
													title: "Innovative Tech",
													desc: "Smart fits powered by smart design.",
												},
												{
													icon: "🛍️",
													title: "Curated Styles",
													desc: "Hand-picked looks updated daily.",
												},
												{
													icon: "🚀",
													title: "Fast Delivery",
													desc: "From screen to street in record time.",
												},
												{
													icon: "🌐",
													title: "Global Reach",
													desc: "We deliver style across borders.",
												},
											].map((feature, i) => (
												<Grid2
													item
													xs={12}
													md={3}
													key={i}
												>
													<Box textAlign="center">
														<Typography fontSize="40px">
															{feature.icon}
														</Typography>
														<Typography
															variant="h6"
															fontWeight="bold"
															mt={1}
														>
															{feature.title}
														</Typography>
														<Typography
															variant="body2"
															color="gray"
														>
															{feature.desc}
														</Typography>
													</Box>
												</Grid2>
											))}
										</Grid2>
									</Typography>
								</Box>
							</Container>
						</Grid2>
					)}
					{(!items || items.length <= 0) && (
						<Box marginBottom="3000px"></Box>
					)}
				</Container>
				<Box marginTop="-50px"></Box>
			</Box>

			{/* Scrolling Quote Section */}
			<Box
				sx={{
					marginTop: 10,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100px",
					overflow: "hidden",
					position: "relative",
				}}
			>
				<Typography
					variant="h4"
					fontWeight="bold"
					sx={{
						position: "absolute",
						animation: `${scrollText} 10s linear infinite`,
						whiteSpace: "nowrap",
						color: "#00ffc3",
					}}
				>
					Minimalist streetwear. Built different. → Where tech meets
					texture.
				</Typography>
			</Box>

			{/* Testimonials Section */}

			<Footer />
		</Box>
	);
}

export default LandingPage;
