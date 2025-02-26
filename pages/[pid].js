import { Fragment } from "react";
import path from "path";
import fs from "fs/promises";

function ProductDetailPage(props) {
  const { loadedProduct } = props;
  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const prodcutId = params.pid;

  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const product = data.products.find((product) => product.id === prodcutId);

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// Dynamic Page의 경우, 서버 측에서 얼마나 많은 양의 상세페이지가 로드될지 알 방법이 없기 때문에
// 다음과 같은 getStaticPaths()없이 getStaticProps()만 사용해 데이터를 가져오면 에러가 발생한다.
export async function getStaticPaths() {
  return {
    paths: [
      { params: { pid: "p1" } },
      { params: { pid: "p2" } },
      { params: { pid: "p3" } },
    ],
    fallback: false,
  };
}

export default ProductDetailPage;
