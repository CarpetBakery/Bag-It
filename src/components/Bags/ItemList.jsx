import {
	Button,
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListSubheader,
	ListItemText,
	Box,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { api, Backend } from "../../api";
import { Url } from "../../constants";

// List of items used in the bag edit page

function ItemList({ items, deleteItem }) {
	const [actualItems, setActualItems] = useState([]);

	useEffect(() => {
		getClothingItems();
	}, [items]);

	async function getClothingItems() {
		// Exit if there's nothing to search for
		if (items.length <= 0) return;

		try {
			// Get list of clothing ids to send to the backend
			let ids = [];
			for (let i = 0; i < items.length; i++) {
				ids.push(items[i].clothingItem);
			}

			// Get clothing items from backend
			let tempItems = await Backend.getClothingItems(ids);
			setActualItems(tempItems);
		} catch (error) {
			alert(error);
		}
	}

	function createListItems() {
		// Prevent crashes
		if (items.length != actualItems.length) {
			return;
		}

		let result = [];

		for (let i = 0; i < actualItems.length; i++) {
			let actualItem = actualItems[i];
			let item = items[i];

			result.push(
				<Box>
					<Link to="/item" state={{ ...actualItem }}>
						<ListItem
							sx={{
								animation: "fadeIn 0.2s ease-in-out",
								// outline: "1px solid"
							}}
						>
							<ListItemAvatar sx={{ marginRight: "10px" }}>
								<img
									width={64}
									height={64}
									src={actualItem.image}
									alt={actualItem.name}
								/>
							</ListItemAvatar>
							<ListItemText primary={actualItem.name} />
							<Button
								color="secondary"
								variant="outlined"
								onClick={(e) => deleteItem(e, item.id)}
							>
								Delete
							</Button>
						</ListItem>
					</Link>
				</Box>
			);
		}

		return result;
	}

	return (
		<>
			<List
				sx={{
					width: "100%",
					maxWidth: 500,
					bgcolor: "background.paper",
				}}
				component="nav"
				subheader={
					<ListSubheader component="div" id="nested-list-subheader">
						Bag Items
					</ListSubheader>
				}
			>
				{createListItems()}
			</List>
		</>
	);
}

export default ItemList;
