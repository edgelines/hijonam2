# hijonam.com

### TodoList || Bug Report
- Tablet.Ver Pre-Style

### 2023.10.07
- 삼성동 사무실+집 : main
    - pc + Mobile 스타일링 Master 작업
    - Mobile 
        - Home : Autobiography 추가, link연결
        - Autobiography Detail Link 수정
    - Webpack Config 
        - 라우터에서 페이지 랜더링 안되는 부분 수정
        - public > img 이미지
        - watchOptions: { ignored: /node_modules/ },
        - output: { publicPath: '/', }, 
        - devtool: "eval",  
        - devSever : {historyApiFallback: true,}
        - 빌드시 pubilc의 img > dist로 이동

### 2023.10.06
- CRA -> Babel + Webpack 

### 2023.10.05
- 모바일용 webp : 임시제거.  : dev-mobile-4
    - 가비아서버에서 sharp 라이브러리 먹통.
- swiper height : 145px 픽셀단위로 맞춤. vh, svh dvh lvh 하게 되면 아이폰6s와 아이폰13프로랑 높이가 차이가남 : dev-mobile-4
    - artworksPage, photosPage

### 2023.10.04
- 모바일 이미지처리 최적화 : master
   - 파일확장자 뒤에 -thumbnail.webp 추가
- Admin
    - Autobiography Quill editor Curser Bug  고쳐짐.. 아마도 body > transform: skew(-0.05deg); 의 영향인듯.
    - photosPage : Add시 uploadDate 안나오는거 수정

### 2023.10.03
- Mobile Page : dev-mobile_2nd => body > transform: skew(-0.05deg); 제거
    - Exhibition
            - Past 
                - Solo-Group 버튼 전환시 원위치
                - 엄지로 약간씩 좌우 스와프 걸리는 영역 줄임 ( maxWidth : 90vw ) => 원위치
- Mobile Page : dev-mobile-3nd
    - Autobiography DetailPage
        - 공유하기 버튼 수정 => 이부분은 웹에서 공유하기를 권고
- Mobile Page : Master
    - Artworks : 작품갯수가 2개 이하일경우 예외처리

### 2023.09.28 ~ 2023.10.02
- Mobile Pabe
    - Mui Timeline => react-chrono npm i react-vertical-timeline-component : 다시 원위치 : maxWidth 를 91vw로 
    - [x] Menu Btn 원위치 로직
    - [x] Home
    - Biography
        - [x] Biography
        - [x] Autobiography
        - [x] Photos
            - 포토 영역 Artworks FreeMode 넣기
    - [x] Artworks : FreeMode
    - Exhibition
        - Past 
            - Solo-Group 버튼 전환시 왼쪽 픽셀이 살짝 밀림
            - [x] 엄지로 약간씩 좌우 스와프 걸리는 영역 줄임 ( maxWidth : 90vw )
        - [x] Present
    - [x] Contact


### 2023.09.27
- Autobiography 
    - [x] 조회수 추가 :{dev-autobiographyView}
    - [x] AdminPage 'views' 코드 추가 :{dev-autobiographyView}
    - [x] 마우스 오버 기능 :{dev-autobiographyView}
    - [x] 영문만 Crimtext :{dev-autobiographyView}
    - [x] Router 버그 수정 :{dev-autobiographyView}
    - [x] 카카오톡 공유 :{dev-autobiographyView}
    - [x] 프린터 기능 :{dev-autobiographyView}
    - css 스타일링 :{dev-autobiographyView}
        - [x] User View Page
        - [x] User Pring Page
        - [x] Admin Quill Editor
- [x] Biography Title 약간 오른쪽으로, 대문자
    - Education => Awards => Artistic Engagement
- Admin Price Policy 호 S형 수정

### 2023.09.26
- Bio Tab -> Router 로 Url
    - [x] BioPage Router :{dev-url}
    - [x] Btn Click Selected Effect :{dev-viewPage}
- [x] Home See All Links :{dev-viewPage}

    
### 2023.09.25
- Admin Autobiography
    - [x] Edit 눌렀을때 수정 컴포넌트
    - [x] 리얼데이터 insert
    - git branch 
        => https://velog.io/@stakbucks/React-Quill-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0-2
        - Quill 글쓰기시 커서 깜박임이 보이질 않음. 

- User page Autobiography
    - [x] list, Detailpage View
    - [x] 상세 페이지 고유 url 
    - [ ] 게시글 공유 기능

### 2023.09.22
- [ ] 퍼블리싱 페이지 글쓰는 영역 연구 : react-html-parser, toast ====> react.@18 지원 하는 ReactQuill 로 변경
    - [x] actionUploadImage 작성중
    - [x] Post Image Upload 완료
    - [ ] Edit 눌렀을때 수정 컴포넌트

### 2023.09.21
- Admin
    - [x] 리포트 페이지 완료
    - [x] 이미지 폴더명 변경 : img/Photos/Studio USA -> img/Photos/Studio US
    - [x] photo Page
    - [ ] 퍼블리싱 페이지 글쓰는 영역 연구 : react-html-parser, toast

### 2023.09.20
- nav 
    - [x] 인스타그램 링크 글자폰트 + 1px, 위치 살짝 위로
    - [x] 간지에 Title 밑에 소제목 추가
    - [x] 간지 배경 어둡게 + 간격 조절
    - [x] Photos Page memo us <-> kr 
- Admin
    - [x] Price Policy From
    - [x] 연락처 페이지 => DataGrid + Search Toolbar
    - [x] 연락처 페이지 칼럼 추가 ( memo )
    - [ ] 리포트 페이지 => Highcharts 
    - [ ] photo Page
    - [ ] 퍼블리싱 페이지 글쓰는 영역 연구 : react-html-parser, toast

### 2023.09.19
- PC ver 요구사항 수정 완료
- [x] En <-> Kr Navbar로 이동
- Admin Page
    - [x] Price List
    - [ ] Price Policy From 진행중

### 2023.09.18
- 삼성동 사무실: 회의하면서 전체적 디자인 수정
    - User View에 간지 추가
    - Navbar에 Collapse 데모버전 추가
    - PhotoPage 선택적 이미지 6칸으로 변경
    - SortPage 디자인 수정
    - HomePage 간격 수정
- [ ] En <-> Kr Navbar로 이동
- [x] 일반 폰트 13px, Havetica
- [x] public/server.js 생성

### 2023.09.17
- ArtworksHistory
    - [x]서버코드 연동 프롭스 전달 추가 해야함
    - [x] Dialog 랜더링 코드 작업중.
        - [x] Date 처리
        - [x] 원단위 콤마
        - [x] 숫자를 한글로
        - [x] Current Location Select

### 2023.09.16
<!-- - App.css : root에 --bs-gutter-x: 0; 추가하고 build함 -->
- Artworks 1안 제거 ( Slider )
- App.jsx : className gx-0, p-0 추가
- sortPage : 좌측 이미지 나열 80px * 80px 로 변경 .. Export 재정렬
- nav : 인스타그램 링크 폰트 재수정, admin 아이콘 우측 여백 수정
- photoPage : 그리드 수정
- BioTable, ExhibitionTable  // 컴포넌트 최적화 ( Post, Put 변수 바로 전송 )
- Artworks 
    - [x] 이미지 순서변경 : 그랩부분 다시 확인 => 윈도우에선 잘 표기됨.
    - 이미지 추가/삭제/변경 : 컴포넌트 최적화 완료
- ArtworksHistory
    - [ ]서버코드 연동 프롭스 전달 추가 해야함
    - [ ] Dialog 랜더링 코드 작업중.
        - [ ] Date 처리
        - [ ] 원단위 콤마
        - [ ] 숫자를 한글로
        - [ ] Current Location Select

### 2023.09.15
- UserAccount, Contact 완료
- artworksHistory 
    - 랜더링 최적화 => 컴포넌트화 // Exhibition, Bio, Artworks 최적화 ( 컴포넌트 메모이제이션, 불필요한 렌더링 방지: React.memo를 사용 )
    - Dialog => 서버코드 연동작업중

### 2023.09.14
- Artworks 추가/편집/삭제 완료
- 이미지 순서 변경 완료 ( React-SortableJS 사용 )
- Exhibition 완료 (Solo, Group, Upcoming)
- Admin Artworks, BioTable, ExhibitionTable, UpcominTable : DB CRUD => dialog 누락부분 추가

### 2023.09.13
- Artworks 첫 랜더링시 안되는부분 UseEffect 추가
- 하단 overflow-x: hidden; 처리
- Admin 
    - Home Image : Files 처리 확인
    - Bio Table Handler 확인
    - Genres 완료.

### 2023.09.12
- Artworks 1안, 2안 
- Grid 1차 작업완
- Admin
    - [x] Login
    - [x] Home
    - Home Image : Input File 처리부분 재확인
    - Bio Table : awards handler 작동확인

### 2023.09.09
- Photos Slider 이미지 1개일 경우 나타나는 버그 수정
- Artworks 페이지 작업중 
    - 파란선 정렬 안됨.

### 2023.09.08
- Other Moments 오타 수정
- Photos Page Layout
- Photos Slider => 이미지가 1개일때 버그가 있음

### 2023.09.07
- Bio => My Mother Hijo 
- Grid 전체 수정 해야함
### 2023.09.05
- vue3 -> react 