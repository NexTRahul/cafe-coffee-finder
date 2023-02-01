import { fetchCoffeeStores } from "@/lib/coffe-stores";

const getCoffeeStoreByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    console.error("There is a Error :", err);
    res.status(500);
    res.json({ message: "Something went wrong", err });
  }
};

export default getCoffeeStoreByLocation;

// http://localhost:3000/api/getCoffeeStoreByLocation?latLong=43.65267326999575,-79.39545615725015&limit=10
