import Head from "next/head";
import Image from "next/image";
import Banner from "@/components/Banner/banner";
import Card from "@/components/Card/card";
import { useContext, useState, useEffect } from "react";

import styles from "@/styles/Home.module.css";
import { fetchCoffeeStores } from "@/lib/coffe-stores";
import UseTrackLocation from "@/hooks/use-track-location";
import { ACTION_TYPES, StoreContext } from "../store/store-contex";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    UseTrackLocation();
  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { state, dispatch } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function setCoffeeSoreNearMe() {
      if (latLong) {
        try {
          // const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
          // console.log({ fetchedCoffeeStores });
          // setCoffeeStores(fetchedCoffeeStores);

          // Using own server-less API.
          const fetchedCoffeeStores = await fetch(
            `/api/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`
          );
          const coffeeStores = await fetchedCoffeeStores.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeeStoresError("");
        } catch (error) {
          console.error({ error });
          setCoffeeStoresError(error);
        }
      }
    }
    setCoffeeSoreNearMe();
  }, [dispatch, latLong]);
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Cafe Coffe Finder</title>
        <meta
          name="description"
          content="Discover coffee stores in your area"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Loading..." : "View Stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            alt="hero-image"
            src="/static/images/hero-image.png"
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near you</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStores) => {
                return (
                  <Card
                    key={coffeeStores.id}
                    name={coffeeStores.name}
                    imgUrl={
                      coffeeStores.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStores.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStores) => {
                return (
                  <Card
                    key={coffeeStores.id}
                    name={coffeeStores.name}
                    imgUrl={
                      coffeeStores.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStores.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
