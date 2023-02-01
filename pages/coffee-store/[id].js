import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import { isEmpty } from "../../utils";
import useSWR from "swr";

import { fetchCoffeeStores } from "@/lib/coffe-stores";
import styles from "../../styles/coffee-store.module.css";
import { StoreContext } from "@/store/store-contex";

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() == params.id; //dynamic_id
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    }, // will be passed to the page component as props
  };
}
export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}
const CoffeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });
      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore, coffeeStores]);
  if (router.isFallback) {
    return <div>Loading..</div>;
  }
  const { name, imgUrl, neighbourhood, address } = coffeeStore;
  const [vote, setVote] = useState(0);
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVote(data[0].voting);
    }
  }, [data]);
  const handleUpVoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = vote + 1;
        setVote(count);
      }
    } catch (err) {
      console.error("Error upvoting coffee store", err);
    }
  };
  if (error) {
    return <div>Something Went Wrong retriving Coffee Store.</div>;
  }
  return (
    <div>
      <Head>
        <title>{name}</title>
        <meta
          name="description"
          content={`Discover ${name} coffee stores`}
        />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link legacyBehavior href="/">
              <a>← Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            alt="coffe-shop-img"
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            }
            width="600"
            height="360"
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              alt="place-icon"
              src="/static/icons/places.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              alt="star-icon"
              src="/static/icons/star.svg"
              width={24}
              height={24}
            />
            <p className={styles.text}>{vote}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};
export default CoffeStore;
