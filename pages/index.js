import { createClient } from "contentful";
import CarCard from "../components/CarCard";

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: "carProfiles" });

  return {
    props: {
      carProfiles: res.items,
    },
    revalidate: 1,
  };
}

export default function carProfiles({ carProfiles }) {
  console.log(carProfiles);

  return (
    <div className="car-profiles-list">
      {carProfiles.map((item) => {
        return <CarCard key={item.sys.id} item={item} />;
      })}
      <style jsx>{`
        .car-profiles-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
      `}</style>
    </div>
  );
}
