import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { MdError } from "react-icons/md";
import { userRegister } from "../functions/api";

function Register() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		firstname: "",
		lastname: "",
		pass: "",
		pass_confirmed: ""
	});

	const { email, firstname, lastname, pass, pass_confirmed } = formData;

	const [errorMessage, setErrorMessage] = useState("");


	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (pass !== pass_confirmed) {
			return setErrorMessage("Passwords do not match");
		}

		try {
			await userRegister(formData);
			navigate("/dashboard");
		} catch (error) {
			return setErrorMessage("Try again, something went wrong");
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = event.target;
		setErrorMessage("");
		setFormData((prevFormData) => ({
			...prevFormData,
			[id]: value,
		}));
	};

	return (
		<div className="absolute top-0 flex items-center justify-center h-screen w-screen bg-cover bg-center bg-register ">
			<div className="rounded-md md:w-1/3 lg:bg-white/80 lg:p-12 ">
				<div className="flex flex-col justify-center mb-12">
					<div className="mx-auto">
						<h1 className="text-lg w-72 font-bold">Registrera dig</h1>
						<h2 className="w-72 mb-2">till GrannskapsRätten</h2>
					</div>
					<form onSubmit={handleSubmit} className="mx-auto flex flex-col gap-4">
						<Input
							type="email"
							inputID="email"
							labelText="Email"
							opacity={1}
							placeHolder=""
							value={email}
							onChange={handleInputChange}
						/>
						<Input
							inputID="firstname"
							minLength={3}
							labelText="Förnamn"
							opacity={1}
							placeHolder=""
							value={firstname}
							onChange={handleInputChange}
						/>
						<Input
							inputID="lastname"
							minLength={3}
							labelText="Efternamn"
							opacity={1}
							placeHolder=""
							value={lastname}
							onChange={handleInputChange}
						/>
						<Input
							type="password"
							minLength={4}
							inputID="pass"
							labelText="Nytt lösenord"
							opacity={1}
							placeHolder=""
							value={pass}
							onChange={handleInputChange}
						/>
						<Input
							type="password"
							minLength={4}
							inputID="pass_confirmed"
							labelText="Bekräfta lösenord"
							opacity={1}
							placeHolder=""
							value={pass_confirmed}
							onChange={handleInputChange}
						/>
						<Button>Login</Button>
					</form>
					{errorMessage && (
						<div className="flex justify-center items-center my-4 border-2 border-red-700 p-1">
							<MdError className="text-xl mr-3 text-red-700"></MdError>
							<p className="font-semibold">{errorMessage}</p>
						</div>
					)}
					<div className="flex flex-row justify-center gap-8 my-4">
						<h3 className="lg:mr-10 font-bold">Redan kund?</h3>
						<Link to={"/login"} className="underline font-bold text-teal-700">
							Logga in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
