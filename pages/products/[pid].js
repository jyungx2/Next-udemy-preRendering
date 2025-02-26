import { Fragment } from "react";
import path from "path";
import fs from "fs/promises";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  // 💫fallback이 true일 때, 페이지가 즉시 생성되지 않으므로 초기 상태 처리 필요 => 미작성시, 빌드시 오류
  if (!loadedProduct) {
    return <p>Loading...</p>; // 데이터를 불러오는 동안 사용자에게 로딩 상태 표시
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;
  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  // 💡 존재하지 않는 product ID에 대한 요청 처리 (예: P4)
  if (!product) {
    return { notFound: true }; // 존재하지 않는 경우 404 페이지 반환
    // fallback: true일 때, "Loading..." 표시 후 404 (빠른 응답이 중요할 때: 전자상거래/뉴스)
    // fallback: "blocking"이라면, 즉시 404페이지 반환 (SEO가 중요할 때: 블로그, 문서)
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// Dynamic Page의 경우, 서버 측에서 얼마나 많은 양의 상세페이지가 로드될지 알 방법이 없기 때문에
// 다음과 같은 getStaticPaths()없이 getStaticProps()만 사용해 데이터를 가져오면 에러가 발생한다.
export async function getStaticPaths() {
  const data = await getData();
  // 🖍️ 실제 개발 환경에서 짜야 할 코드!! (모든 제품 ID를 가져와서 동적 경로 생성)
  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => {
    return {
      params: {
        pid: id, // 🌟 동적 라우팅을 위한 ID 설정
      },
    };
  });

  return {
    paths: pathsWithParams, // 🌟 `paths` 배열에 포함된 ID들은 미리 생성됨
    // 1️⃣ fallback: true
    fallback: true, // 🖍️'모든' 데이터의 id에 mapping 함수를 씌어 paths값을 설정했으므로 false로..
    // 아마존과 같은 수많은 데이터 로드가 필요한 웹에서는 모든 데이터를 pre-generate하는게 부담!!
    // => 몇가지 빈번히 접속되는 params만 등록하고, 그 외 pathpaths에 포함되지 않은 페이지도 동적 생성 가능하도록 true로 설정.. 즉, 사용자가 드물게 방문하는 페이지는 미리 생성하지 않고 필요할 때만 생성
    // 미리 생성하지 않으면 페이지가 생성될 때까지 시간이 걸리기 때문에 💫초기 로딩 페이지💫 보여줄 필요✅
    // => 빠른 응답을 위해 초기 로딩 페이지를 보여주고, 데이터가 로드되면 업데이트됨

    // 2️⃣ fallback: "blocking"
    // fallback: "blocking",
    // 데이터가 준비될 때까지 기다렸다가 한 번에 페이지를 제공. => 주로 SEO가 중요한 페이지에서 사용됨
    // ✅ paths에 없는 페이지를 방문하면, 데이터가 준비될 때까지 페이지 응답을 지연
    // 즉, 로딩 상태 없이 완전히 생성된 페이지를 반환 (서버에서 먼저 생성 후 클라이언트에 제공)
  };
}

export default ProductDetailPage;
