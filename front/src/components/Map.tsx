import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";
import { useEffect } from "react";
import { GeolocationStore } from "../storage/GeolocationStore";


export default function Map() {
	const { location, error, loading, setLocation, setError, setLoading } = GeolocationStore();

	useEffect(() => {
		setLoading(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				const geoPosition = lat + "," + lng;
				setLocation(geoPosition);
				setLoading(false);
			},
			() => {
				setError("Unable to retrieve your location");
				setLoading(false);
			}
		);

		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser!");
			setLoading(false);
		}
	}, []);

	console.log(location);
	console.log("Loading..." + loading);
	console.log(error);

	const {isLoaded} = useJsApiLoader({
		googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
	});
	if(!isLoaded) return <div>Loading...</div>;

	return(
		<>
			<GoogleMap zoom={10} center={{lat: 59.33, lng: 18.06}} mapContainerClassName="w-screen h-96">
			</GoogleMap>

			{/* {loading && <p>Loading...</p>}
			{error && <p>{error}</p>} */}
			{/* {location && <p>{location}</p>} */}
		</>

	);
}