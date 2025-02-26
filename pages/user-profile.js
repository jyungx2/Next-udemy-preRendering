function UserProfilePage(props) {
  return <h1>{props.username}</h1>;
}

export default UserProfilePage;

export async function getServerSideProps(context) {
  const { params, req, res } = context;

  return {
    props: { username: "Max" },
  };
}

// 💡 getServerSideProps의 주요 기능
// 1️⃣ 매 요청마다 실행
// getStaticProps와 달리, 모든 요청에서 새롭게 실행됨 → 즉, 항상 최신 데이터를 반환
// 따라서 자주 변경되는 데이터(예: 실시간 가격, 사용자 프로필, 대시보드 데이터) 등에 적합
// 💫 데이터가 자주 변하지 않는다면 getStaticProps 또는 ISR이 더 효율적

// 2️⃣ Node.js의 req, res 객체 활용 가능
// context 객체에서 요청(Request) 및 응답(Response) 객체를 직접 다룰 수 있음
// Express.js에서 사용하는 것과 유사한 방식으로 헤더, 쿠키 데이터 등을 읽거나 수정 가능
// ex) res.setHeader("Cache-Control", "no-store"); // 응답 헤더 설정 (캐싱 방지)

// 3️⃣ 동적 데이터 페칭 가능
// API 요청을 실행하여 매 요청마다 최신 데이터를 가져올 수 있음

// 4️⃣ 정적인 HTML을 미리 생성하지 않음
// getStaticProps와 다르게, getServerSideProps를 사용하면 빌드 타임에 정적인 HTML을 만들지 않음
// 즉, Next.js가 모든 요청을 서버에서 처리
