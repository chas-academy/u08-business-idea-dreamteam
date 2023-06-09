import Input from "../components/Input";
import Button from "../components/Button";
import { BsArrowLeft } from "react-icons/bs";
import { MdKeyboardArrowLeft, MdError } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createOneProduct } from "../functions/api";
import useStoreUser from "../storage/UserStorage";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function CreateProduct() {
	const navigate = useNavigate();
	const apiKey = import.meta.env.VITE_MAPS_API_KEY;
	const [value, setValue] = useState<any>();
	const categoryTags = ["tilltugg", "förrätt", "soppa", "sallad", "huvudrätt", "vegetariskt", "vegansk", "dessert"];
	const {storeUser} = useStoreUser();
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [hideInput, setHideInput] = useState(false);
	const [formData, setFormData] = useState<any>({
		uid: storeUser,
		title: "",
		desc: "",
		free: false,
		price: 0,
		expire: ["", ""],
		tags: [""],
	});
	const [errorMessage, setErrorMessage] = useState("");


	const handleTagCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id, checked } = event.target;
		let updatedTags = [...selectedTags];

		if (checked) {
			updatedTags.push(id);
		} else {
			updatedTags = updatedTags.filter((tag) => tag !== id);
		}
		setSelectedTags(updatedTags);
		setFormData((prevFormData: any) => ({
			...prevFormData,
			tags: updatedTags,
		}));
	};

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHideInput(event.target.checked);
		const { id, checked } = event.target;

		setFormData((prevFormData: any) => ({
			...prevFormData,
			[id]: checked,
		}));
	};


	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
		const { id, value } = event.target;
		const fileInput = document.getElementById("img") as HTMLInputElement;

		if (id === "img" && fileInput && fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];
			if (file) {
				setFormData((prevFormData: any) => ({
					...prevFormData,
					img: file,
				}));
			} return;
		}else {
			setFormData((prevFormData: any) => ({
				...prevFormData,
				[id]: value,
			}));
		}/*
		new_form_data.set(id, value);
		for (const pair of new_form_data.entries()) {
			console.log(`${pair[0]}: ${pair[1]}`);
		}*/
		setErrorMessage("");
	};

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;
		setFormData((prevFormData: { expire: any[]; }) => ({
			...prevFormData,
			expire: [value, prevFormData.expire[1]],
		}));
	};

	const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setFormData((prevFormData: { expire: any[]; }) => ({
			...prevFormData,
			expire: [prevFormData.expire[0], value],
		}));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const new_form_data = new FormData();
		try {
			for (const key in formData) {
				new_form_data.append(key, formData[key]);
			}
			new_form_data.append("location", value.value.place_id);

			await createOneProduct(new_form_data);
			navigate("/profile");
		} catch (error) {
			setErrorMessage("Try again, something went wrong");
		}
	};

	return (
		<div className="max-w-5xl mx-auto">
			<div className="flex justify-center items-center my-4">
				<div className="min-[800px]:mr-72">
					<Link to="/profile">
						<button className="md:hidden mr-20 max-[350px]:mr-22">
							<BsArrowLeft size={25} />
						</button>
						<button className="max-[800px]:hidden">
							<MdKeyboardArrowLeft size={40} />
						</button>
					</Link>
				</div>
				<h2 className="flex min-[800px]:mr-72 text-xl font-bold mr-28">
					Ny annons
				</h2>
			</div>
			<div className="flex justify-center items-center">
				<form onSubmit={handleSubmit} className="lg:flex min-[320px]:block" encType="multipart/form-data">
					<div className="lg:mr-20">
						<Input
							onChange={handleInputChange}
							inputID="title"
							labelText="Rubrik"
							require
						/>
						<div className="flex flex-col my-4">
							<label htmlFor="desc">Beskrivning</label>
							<textarea
								className="box-border w-72 rounded border-solid border-gray-300 border p-2"
								id="desc"
								name="desc"
								rows={6}
								maxLength={300}
								onChange={handleInputChange}
							></textarea>
						</div>
						<label htmlFor="">Kategori</label>
						{categoryTags.map((tag: string) => (
							<div key={tag} className="my-2 capitalize">
								<input
									className="text-sm"
									type="checkbox"
									id={tag}
									checked={selectedTags.includes(tag)}
									onChange={handleTagCheckboxChange}
								/>
								<label htmlFor={tag} className="ml-2 my-2">{tag}</label>
							</div>
						))}


					</div>

					<div className="flex flex-col gap-4">
						<label htmlFor="googleLocation">Address</label>
						<GooglePlacesAutocomplete
							apiKey={apiKey}
							selectProps={{
								inputId: "googleLocation",
								placeholder: "Ange en address",
								value,
								onChange: setValue,
							}}
						/>

						<input hidden type="text" id="location"></input>

						<Input
							onChange={handleInputChange}
							type="file"
							inputID="img"
							labelText="Välj en bild"
							require
						/>
						<div>
							<label htmlFor="price" className="block my-2">
								Pris
							</label>
							<label htmlFor="free" className="text-sm mx-2">
								Bortskänkes
							</label>
							<input
								type="checkbox"
								id="free"
								onChange={handleCheckboxChange}
							/>
							{!hideInput && (
								<Input
									onChange={handleInputChange}
									type="number"
									inputID="price"
								/>
							)}
						</div>

						<label htmlFor="dates" className="block my-2">
							Tillagning/utgångsdatum
						</label>
						<select
							id="dates"
							className="block my-2 px-5 box-border h-11 rounded border-solid border-gray-300 border"
							onChange={handleSelectChange}
						>
							<option value="tillagning">Tillagningsdatum</option>
							<option value="utgångsdatum">Utgångsdatum</option>
						</select>
						<input
							onChange={handleDateChange}
							type="date"
							id="expire"
							className="block mt-2 mb-5 px-6 box-border h-11 rounded border-solid border-gray-300 border"
						/>

						<div className="block">
							<Button>Spara annons</Button>
							{errorMessage && (
								<div className="flex justify-center items-center my-4 border-2 border-red-700 p-1">
									<MdError className="text-xl mr-3 text-red-700"></MdError>
									<p className="font-semibold">{errorMessage}</p>
								</div>
							)}
						</div>
					</div>
				</form>

			</div>
		</div>
	);
}

export default CreateProduct;