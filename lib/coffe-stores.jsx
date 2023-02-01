import { createApi } from "unsplash-js";

// Initialize Unsplash API
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getApiUrl = (latLng, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLng}&limit=${limit}`;
};
const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
    orientation: "landscape",
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((results) => results.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.NEXT_PUBLIC_FSQ_AUTH}`,
    },
  };

  const response = await fetch(
    getApiUrl(latLong, "coffee store", limit),
    options
  );
  const data = await response.json();
  return data.results.map((results, idx) => {
    return {
      // ...results,
      id: results.fsq_id,
      address:
        results.location.address || results.location.formatted_address || "",
      name: results.name,
      neighbourhood:
        (results.neighbourhood &&
          results.neighbourhood.length > 0 &&
          results.neighbourhood[0]) ||
        results.location.cross_street ||
        "",
      imgUrl: photos[idx],
    };
  });
};
