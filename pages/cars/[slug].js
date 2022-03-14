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
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { items } = await client.getEntries({
    content_type: "carProfiles",
    "fields.slug": params.slug,
  });

  return {
    props: { carProfiles: items[0] },
  };
};

export default function RecipeDetails({ carProfiles }) {
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
        <h3>Method:</h3>
        <div>{documentToReactComponents(body)}</div>
      </div>

      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  );
}
