import path from "path";
import fs from "fs/promises";

function HomePage(props) {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData); // JSON string -> JS Object (convert)

  return {
    props: {
      products: data.products,
    },
    revalidate: 120, // 어떤 앱을 만들지에 따라 달라진다. (dev모드에서는 nodemon에 의해서 모든 요청에 대해 새로운 데이터를 업데이트해서 필요없지만, production모드에서는 중요한 코드!!)
  };
}

export default HomePage;
