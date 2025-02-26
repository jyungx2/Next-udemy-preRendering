function UserIdPage(props) {
  return <h1>{props.id}</h1>;
}

export default UserIdPage;

export async function getServerSideProps(context) {
  const { params } = context;
  const userId = params.uid;

  return {
    props: {
      id: "userid-" + userId,
    },
  };
}

// 💡 Dynamic page([uid].js)에서 getServerSideProps를 사용하면 getStaticPaths가 필요없다!!
// 1. getStaticProps를 사용할 때는 정적인 페이지를 미리 생성(pre-generate) 해야 하므로, Next.js가 미리 생성할 페이지의 경로를 알아야 함 → getStaticPaths 필수
// 2. 하지만 getServerSideProps는 매 요청마다 실행되므로, 페이지를 미리 생성할 필요가 없음 → getStaticPaths가 필요 없음
// ✅ userId에 따라 데이터가 바뀌는 동적페이지임에도 불구하고, getStaticPaths 함수 없이도 위의 코드가 정상적으로 실행됨.
