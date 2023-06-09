import React from "react";
import { Key, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Map from "../components/Map";
import ProductShow from "../components/ProductShow";
import Search from "../components/Search";
import { Advertisement } from "../components/Advertisement";
import { getProducts } from "../functions/api";
import useStoreUser from "../storage/UserStorage";

export interface Products {
	foods: unknown;
	length: number;
    tags: string;
    _id: Key | null | undefined;
    price: number | boolean | undefined;
    desc: string;
    title: string;
    img: string;
}

export default function Dashboard(this: unknown) {
	const [data,  setData] = useState<Products[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
	const [filterActive, setFilterActive] = useState(false);
	const [activeFilterProducts, setActiveFilterProducts] = useState(false);
	const { storeUser } = useStoreUser();

	const genGetAllProducts = async () => {
		const res = await getProducts();
		const filteredUser = res.filter((user: { _id: unknown; }) => user._id !== storeUser);
		const products = filteredUser.flatMap((item: { foods: unknown; }) => item.foods);
		setData(products);
	};

	useEffect(() => {
		genGetAllProducts();
	}, []);

	const handleClick = async (filter:string) => {
		setData([]);
		const res = await getProducts();
		const filteredUser = res.filter((user: { _id: unknown; }) => user._id !== storeUser);
		const products = filteredUser.map((res: { foods: unknown; }) => res.foods);
		const filteredItems = products.flat().filter((item: { tags: string | string[]; }) => item.tags && item.tags.includes(filter));
		setFilteredProducts(filteredItems);

		setActiveFilterProducts(true);
		if (activeFilterProducts) {
			setFilteredProducts(filteredItems);
		}
	};

	const resetFilter = (filter:string) => {
		setFilterActive(!filterActive);
		handleClick(filter);
		genGetAllProducts();
	};

	return (
		<>
			<Map data={data}></Map>

			<Search
				name="Sök efter plats..."
				filtered
				onClick={handleClick}
				reset={resetFilter}
			></Search>

			{data && <section className="w-10/12 max-w-7xl mx-auto my-4 grid col-auto gap-5 lg:grid-cols-2">

				{ data.map((item, idx) => (
					<React.Fragment key={item._id}>
						<section>
							<ProductShow
								to={`/product/${item._id}`}
								imgUrl={item.img}
								title={item.title}
								description={item.desc}
								add={false}
								price={item.price}
							></ProductShow>
						</section>
						{ (idx !== 0 && idx % 3 === 0) && <><section><Advertisement/></section></> }
					</React.Fragment>
				))}

				{ filteredProducts.map((item,  idx) =>
					<React.Fragment key={item._id}>
						<section>
							<ProductShow
								to={`/product/${item._id}`}
								imgUrl={item.img}
								title={item.title}
								description={item.desc}
								add={false}
								price={item.price}
							></ProductShow>
						</section>
						{ (idx !== 0 && idx % 3 === 0) && <><section><Advertisement/></section></> }
					</React.Fragment>
				)}
			</section>}

			<Link to={"/product/create"} className="my-4 flex flex-col items-center"><Button>Lägg upp egen annons</Button></Link>
		</>
	);
}