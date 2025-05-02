# Project Name: 영화 예매 웹사이트

## Features

- React + TypeScript + Vite for Frontend
- PicoCSS used for basic styling

---

## Team Members

- 부김은
- 구효근
- 조성채

---

## Project Setup

- See [VITE-SETUP.md](./VITE-SETUP.md) for details about the development environment and configuration.

---

## Routing:

- 이 프로젝트는 client-side routing을 위해 React Router를 사용한다.
- 모든 라우트 설정은 `route/` 폴더 안의 `MyRoute.tsx` 파일에서 관리된다.
- 경로 관리는 `enum`(`AppRoutes`)을 사용하여 쉽게 관리할 수 있도록 구성되어 있다.
- 추후 `MyRoute.tsx`에 `<Route>` 요소를 추가하여 로그인 페이지, 회원가입 페이지 등을 연결할 예정이다.

### MyRoute.tsx 예시

- 사용자가 `/` 경로를 방문하면, `HomePage` 컴포넌트가 렌더링된다.

---
