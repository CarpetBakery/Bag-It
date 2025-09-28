<Container maxWidth="lg">
	<div className="ItemContainer">
		{product.image ? (
			<img src={product.image} alt={product.name} className="Image" />
		) : (
			<p>No image available</p>
		)}

		<div className="ItemInfo">
			<h1 className="Name">{product.name || "Unknown Product"}</h1>
			<p className="description">
				{product.description || "No description available."}
			</p>
		</div>

		<div className="tagList">
			<h2 className="tag">
				Size:{" "}
				{{
					0: "Extra Small",
					1: "Small",
					2: "Medium",
					3: "Large",
					4: "Extra Large",
				}[product.size] || "N/A"}
			</h2>
			<h2 className="tag">
				Type:{" "}
				{{
					0: "Shorts",
					1: "Pants",
					2: "T-Shirt",
					3: "Dress",
					4: "Shoes",
					5: "Hat",
					6: "Hoodie",
					7: "Shirt",
				}[product.type] || "N/A"}
			</h2>
			<h2 className="tag">Colour: {product.color || "N/A"}</h2>
			<h2 className="tag">
				Gender:{" "}
				{{ 0: "Male", 1: "Female", 2: "Unisex" }[product.gender] ||
					"N/A"}
			</h2>
			<h2 className="tag">Brand: {product.brand || "N/A"}</h2>
		</div>
		<p>Item ID: {product.id}</p>

		{loggedIn && (
			<div className="addButtons">
				<div className="existing">
					<Button
						className="addToExistingButton"
						variant="contained"
						onClick={addExistingBagPressed}
					>
						Add Me to Existing Bag!
					</Button>

					{/* Existing bag dialog */}
					<Dialog
						open={openExistingDialog}
						onClose={() => setOpenExistingDialog(false)}
					>
						<DialogTitle>Select a Bag</DialogTitle>
						<DialogContent>
							<p>
								Here you can select an existing bag to add this
								product to.
							</p>
							<ExistingBagList bags={bags} product={product} />
						</DialogContent>
						<DialogActions>
							<Button
								loading={loading}
								onClick={() => setOpenExistingDialog(false)}
							>
								Cancel
							</Button>
							{/* <Button
												loading={loading}
												onClick={
													confirmExistingBagPressed
												}
												variant="contained"
											>
												Confirm
											</Button> */}
						</DialogActions>
					</Dialog>
				</div>

				<div className="new">
					<Button
						className="addToNewButton"
						variant="contained"
						onClick={addNewBagPressed}
					>
						Add Me to New Bag!
					</Button>

					{/* New bag dialog */}
					<NewBagDialog
						setOpenNewDialog={setOpenNewDialog}
						openNewDialog={openNewDialog}
						confirmNewBagPressed={confirmNewBagPressed}
						loading={loading}
					/>
				</div>
			</div>
		)}
	</div>
</Container>;
