import { createClient } from "contentful";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: "carProfiles",
  });

  const paths = res.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { items } = await client.getEntries({
    content_type: "carProfiles",
    "fields.slug": params.slug,
  });

  if (!items.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { carProfiles: items[0] },
    revalidate: 1,
  };
};

export default function RecipeDetails({ carProfiles }) {
  if (!carProfiles) return <div>Loading</div>;

  const { featureImage, title, characteristics, body } = carProfiles.fields;

  return (
    <div>
      <div className="banner">
        <Image src={"https:" + featureImage.fields.file.url} width={featureImage.fields.file.details.image.width} height={featureImage.fields.file.details.image.height} />
        <h2>{title}</h2>
      </div>

      <div className="info">
        <h3>Ingredients:</h3>

        {characteristics.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="method">
        <h3>Description:</h3>
        <div>{documentToReactComponents(body)}</div>
      </div>

      <style jsx>{`
        * {
          color: #fff;
        }
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          color: #010101;
          display: inline-block;
          padding: 19px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        h3 {
          color: #fff;
        }
        .info p {
          margin: 0;
          color: #fff;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
        p {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
