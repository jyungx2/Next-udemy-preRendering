import path from "path";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

function HomePage(props) {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData); // JSON string -> JS Object (convert)

  // getStaticProps의 Configuration Options
  // 1. data가 없을 경우 '/no-data' url로 리다이렉트
  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  // 2. data의 products 배열이 비었을 경우, 404 페이지를 반환하도록
  if (data.products.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10, // 어떤 앱을 만들지에 따라 달라진다. (dev모드에서는 nodemon에 의해서 모든 요청에 대해 새로운 데이터를 업데이트해서 필요없지만, production모드에서는 중요한 코드!!)
    // notFound: true, // 404 page 렌더링 -> 데이터가 없을 경우에 실행되도록, if 조건문으로 리턴
  };
}

export default HomePage;
