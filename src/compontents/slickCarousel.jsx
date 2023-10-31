import styled, { keyframes, css } from "styled-components";
import Slider from "react-slick";
import { Grid, Stack, Typography } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

export const StyledSlider = styled(Slider)`
   height: 100%; //슬라이드 컨테이너 영역

  .slick-list {  //슬라이드 스크린
    width: 90%;
    height: 100%;
    margin: 0 auto;
    overflow-x: hidden;
    // background: green;
  }

  .slick-slide div { //슬라이더  컨텐츠
    height: 100%; // 이 부분을 추가하여 각 슬라이드 아이템에 높이를 부여합니다.
    display: flex; // 이 부분을 추가하여 flex 컨테이너로 만듭니다.
    flex-direction: column; // 이 부분을 추가하여 flex 아이템들이 column 방향으로 배열되게 합니다.
    justify-content: flex-end; // 이 부분을 추가하여 flex 아이템들이 하단에 정렬되게 합니다.
    align-self : flex-end;
    /* cursor: pointer; */
  }

//   .slick-dots {  //슬라이드의 위치
//     bottom: 20px;
//     margin-top: 200px;
//   }

  .slick-track { //이건 잘 모르겠음
    width: 100%;
    display : flex;
    // flex-direction : column;
    // align-item : end;
  }
`;
export default function SimpleSlider({ genres, handleSelectedGenres }) {
  var settings = {
    // dots: true,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 6000,
    autoplaySpeed: 3500,
    cssEase: "linear"
    // nextArrow: <SampleNextArrow />,
    // prevArrow: <SamplePrevArrow />
  };

  return (
    <StyledSlider {...settings} style={{ height: '100%' }}>
      {genres.map((item) => (
        <Grid container onClick={() => handleSelectedGenres(item.genres)}
          style={{ height: '100%', border: '1px solid tomato' }} direction="column" justifyContent="flex-end" key={item.id}>
          <Grid item container direction="column" alignItems="center" justifyContent="flex-end" style={{ textAlign: 'center', width: '10vw', height: '100%' }} className="mx-auto">
            <Grid item style={{ width: '100%' }}>
              <img src={`/img/artworks/${item.fileName}`} style={{ width: '10vw', objectFit: 'cover', aspectRatio: '1/1', }} />
            </Grid>

            <Typography align="center">
              {item.genres}
            </Typography>

          </Grid>
        </Grid>
      ))}
    </StyledSlider>

    // <StyledSlider {...settings} style={{ height: '300px', border: '1px solid blue' }}>
    //     {genres.map((item) => (
    //         <div className="border" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', border: '1px solid tomato' }}>
    //             <div style={{ textAlign: 'center', width: '10vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', border: '1px solid green' }}>
    //                 <img src={`/img/artworks/${item.fileName}`} style={{ width: '100%', marginBottom: 'auto' }} />
    //                 <Typography align="center" style={{ marginTop: 'auto' }}>
    //                     {item.genres}
    //                 </Typography>
    //             </div>
    //         </div>
    //     ))}
    // </StyledSlider>

  );
}
